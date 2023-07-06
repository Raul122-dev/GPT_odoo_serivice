
# GPT-SERVICE-STREAM

This project manages the messages between an odoo client and the Openai api, so that the response is sent to the client using data streaming.

Additionally it also stores messages from both the user and the Ai model, manages queries from the model to generate actions and response with context. 

## API Reference

#### Post Live Chat

```http
  POST /api/chat
```

| Parameter (body) | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `prompt` | `string` | **Required**. Your prompt user |
| `chat_id` | `int` |  Your chat ID from the database |

#### Post Recommendations

```http
  POST /api/recommendations
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `user`      | `string` | **Required**. The user's last message |
| `assistant`      | `string` | **Required**. The last message from the assistant |


## Demo

Insert gif or link to demo


## Use of PNPM

In this case, we are using [PNPM](https://pnpm.io/) as dependency manager.  

## Getting Started

First add an .env file with the following data:

```bash
OPENAI_API_KEY = sk-************************
URL_OPENAI_COMPLETIONS = https://api.openai.com/v1/completions
URL_ODOO = ********
PORT_ODOO = ****
DB_ODOO = ********
USER_ODOO = ********
```

Run the development server:

```bash
pnpm run dev
# or
npm run dev
```
## Deployment

Before you start, make sure you have it installed:

- Node.js (version 18.16.1)
- npm (version 9.5.0) & pnpm (version 8.6.5)

### Configuration

1. Install the dependencies:

```bash
  pnpm install
```

2. Build the application:

```bash
  pnpm run build
  # or
  npm run build
```

3. Run the application in production mode:

```bash
  pnpm run start
  # or
  npm run start
```
4. The application will be available at the URL provided by the terminal.
## Authors

- [@example](https://www.github.com/)


## License

[MIT](https://choosealicense.com/licenses/mit/)


## Support

For support, email fake@fake.com or join our Slack channel.

