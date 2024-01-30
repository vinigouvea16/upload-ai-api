import { fastifyCors } from '@fastify/cors'
import 'dotenv/config'
import { fastify } from 'fastify'
import { createTranscriptionRoute } from './routes/create-transcription'
import { generateAICompletionRoute } from './routes/generate-ai-completion'
import { getAllPromptsRoute } from './routes/get-all-prompts'
import { uploadVideoRoute } from './routes/upload-video'
const app = fastify()
app.register(fastifyCors, {
  origin: '*',
})

app.register(getAllPromptsRoute)
app.register(uploadVideoRoute)
app.register(createTranscriptionRoute)
app.register(generateAICompletionRoute)

app.setErrorHandler((error, _, reply) => {

  if (process.env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: Here we should log to an external tool like DataDog/NewRelic/Sentry
  }

  return reply.send(error.message)
})

app.listen({
  port: Number(process.env.PORT) || 3333, host: "0.0.0.0"
}).then(()=>{
  console.log('HTTP Server Running!')
})