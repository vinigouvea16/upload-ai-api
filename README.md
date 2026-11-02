# upload.ai API

The backend of **upload.ai**, an app that turns videos into AI-generated YouTube titles and descriptions. It receives the audio extracted from a video, transcribes it with **OpenAI Whisper**, and streams **GPT** completions based on reusable prompt templates.

> Built during NLW 14 (Next Level Week), a Rocketseat event.
> Frontend: [nlw14-upload-ai](https://github.com/vinigouvea16/nlw14-upload-ai)

## Endpoints

| Method | Route                          | Description                                                                 |
| ------ | ------------------------------ | --------------------------------------------------------------------------- |
| GET    | `/prompts`                     | Lists the available prompt templates                                        |
| POST   | `/videos`                      | Uploads an `.mp3` file (multipart, max. 25 MB) and registers it             |
| POST   | `/videos/:videoId/transcription` | Transcribes the audio with Whisper and saves the transcription            |
| POST   | `/ai/complete`                 | Fills a prompt template with the transcription and **streams** the GPT answer |

Example requests are in [`routes.http`](./routes.http).

### `POST /ai/complete`

```json
{
  "videoId": "uuid",
  "prompt": "Generate three titles for this video: {transcription}",
  "temperature": 0.5
}
```

The `{transcription}` placeholder is replaced with the stored transcription before the request goes to the model. Returns `400` if the video has not been transcribed yet.

## Highlights

- **Streaming responses:** GPT output is piped straight to the HTTP response with the Vercel AI SDK, so the user sees text as it is generated.
- **Prompt templates in the database:** prompts are data, not code, so new use cases don't need a deploy. They are seeded with Prisma.
- **Validation with Zod** for params and bodies (UUIDs, temperature between 0 and 1).
- **Streamed file uploads** to disk with `stream.pipeline`, with type and size checks.
- **Centralized error handling** in Fastify.

## Tech stack

- **Node.js** + **TypeScript**
- **Fastify** (+ `@fastify/multipart`, `@fastify/cors`)
- **Prisma ORM** + **PostgreSQL**
- **OpenAI SDK** (Whisper and Chat Completions)
- **Vercel AI SDK** (`ai`) for streaming
- **Zod**

## Running locally

```bash
git clone https://github.com/vinigouvea16/upload-ai-api
cd upload-ai-api
pnpm install
```

Create a `.env` file:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/uploadai"
OPENAI_KEY="your-openai-api-key"
PORT=3333
```

Run the migrations and seed the prompt templates:

```bash
pnpm migrate
pnpm prisma db seed
```

Start the server:

```bash
pnpm dev
```

The API runs at `http://localhost:3333`.

---

Made by [Vinicius Gouvea](https://github.com/vinigouvea16), based on the NLW 14 project by [Rocketseat](https://www.rocketseat.com.br/).
