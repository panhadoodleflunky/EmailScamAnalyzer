import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'

import { registerRestServices } from './services/restService'

dotenv.config()

const app = express()
const port = Number(process.env.PORT ?? 8787)

app.use(cors())
app.use(express.json({ limit: '300kb' }))

registerRestServices(app)

app.listen(port, () => {
  console.log(`Scam analysis API running on http://localhost:${port}`)
})
