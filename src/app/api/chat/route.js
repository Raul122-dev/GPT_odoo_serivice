import { NextResponse } from 'next/server'
import { OpenAIStream } from '@/utils/openAiStream';
import call_functions from '@/utils/call_functions';
import { odooConnection } from '@/utils/odoo_connection';
import { corsHeaders } from '@/utils/cors_config';

export async function OPTIONS(req, res, next) {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req, res, next) {
    const { prompt, chat_id } = await req.json();

    if (!prompt) {
        return new Response("No prompt in the request", { status: 400 });
    }

    if (!chat_id) {
        return new Response("No chat_id in the request", { status: 400 });
    }

    const messages = await odooConnection.get_messages({ chat_id: chat_id , prompt: prompt })

    const payload = {
        model: "gpt-3.5-turbo-0613",
        messages: messages,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        stream: true,
        functions: call_functions,
        function_call: 'auto',
    };

    const stream = await OpenAIStream({payload: payload, prompt: prompt, chat_id: chat_id});
    return new Response(stream, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
    });
}


