import { createParser } from "eventsource-parser";
import { odooConnection } from "./odoo_connection";

if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing env var from OpenAI");
}

const executeFunction = async (functionName, functionArgs) => {
  console.log("llega aqui")
  if (functionName === "consult_odoo_database") {
    console.log("llega aqui consulta")
    const response_context = await odooConnection.consult_odoo_database({ function_args: functionArgs });
    return response_context;
  }
  if (functionName === "search_in_google") {
    const response_context = await odooConnection.search_in_google({ function_args: functionArgs });
    return response_context;
  }
  if (functionName === "count_odoo_records") { 
    const response_context = await odooConnection.count_odoo_records({ function_args: functionArgs });
    return response_context;
  }
  if (functionName === "create_odoo_record") {
    const response_context = await odooConnection.create_odoo_record({ function_args: functionArgs });
    return response_context;
  }
}

const OpenAIStream = async ({payload, prompt, chat_id }) => {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  let functionCall = false;
  let functionArgs = "";
  let functionName = "";

  let text_response = "";

  const firstStream = new ReadableStream({
    async start(controller) {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
        },
        method: "POST",
        body: JSON.stringify(payload),
      });

      const onParse = async (event) => {
        if (event.type === "event") {
          const data = event.data;
          if (data === "[DONE]") {
            console.log('--------------arguments-------------')
            console.log(functionArgs);
            console.log('--------------text_response-------------')
            console.log(text_response);

            if (functionCall) {
              const functionResult = await executeFunction(functionName, functionArgs);

              const secondPayload = {
                model: payload.model,
                messages: [...payload.messages,
                  {
                    role: 'assistant',
                    content: null,
                    function_call: {
                      name: functionName,
                      arguments: functionArgs,
                    }
                  },
                  {
                    role: 'function',
                    name: functionName,
                    content: JSON.stringify(functionResult),
                  }
                ],
                stream: true,
              }

              const res = await openai.createChatCompletion(secondPayload, { responseType: 'stream' });
              
              const secondRes = await fetch("https://api.openai.com/v1/chat/completions", {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
                },
                method: "POST",
                body: JSON.stringify(secondPayload),
              });

              const secondOnParse = async (event) => {
                if (event.type === "event") {
                  const data = event.data;
                  if (data === "[DONE]") {
                      controller.enqueue(encoder.encode('\n'));
                      controller.enqueue(encoder.encode(' '));

                      const action_response = {
                        text: 'DONE',
                        args: functionArgs,
                        status: 'success',
                        action_function: functionResult,
                      }

                      const queue = encoder.encode(JSON.stringify(action_response));
                      controller.enqueue(queue);
                      controller.close();
                      await odooConnection.save_message({
                        is_user: true,
                        chat_id: chat_id,
                        message: prompt,
                      })
                      await odooConnection.save_message({
                        is_user: false,
                        chat_id: chat_id,
                        message: text_response,
                        data: functionResult,
                      })
                      return; // Stream
                  }
                  else {
                    try {
                      const json = JSON.parse(data);
                      const text = json.choices[0]?.delta?.content || "";
                      text_response += text;
                      const queue = encoder.encode(text);
                      controller.enqueue(queue);
                    } catch (error) {
                      console.error('Could not JSON parse stream message', data, error);
                      controller.close();
                    }
                  }
                }
              }

              const secondParser = createParser(secondOnParse);
              for await (const chunk of secondRes.body) {
                  secondParser.feed(decoder.decode(chunk));
              }

            }
            else {
              controller.close();

              await odooConnection.save_message({
                is_user: true,
                chat_id: chat_id,
                message: prompt,
              })
              await odooConnection.save_message({
                is_user: false,
                chat_id: chat_id,
                message: text_response,
              })
            }

            return;
          }
          try {
            const json = JSON.parse(data);
            const newFunctionCall = json.choices[0]?.delta?.function_call || false;
            if (newFunctionCall) {
              functionCall = true;
              if (newFunctionCall.name) {
                functionName = newFunctionCall.name;
              }
              functionArgs += newFunctionCall.arguments || "";
              return;
            }

            const text = json.choices[0]?.delta?.content || "";
            text_response += text;
            const queue = encoder.encode(text);
            controller.enqueue(queue);
          } catch (e) {
            controller.error(e);
          }
        }
      }

      const parser = createParser(onParse);
      for await (const chunk of res.body) {
        parser.feed(decoder.decode(chunk));
      }
    },
  });

  return firstStream;
}

export { OpenAIStream };