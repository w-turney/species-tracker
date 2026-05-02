import express from 'express'
import 'dotenv/config.js'
import apiRouter from './routes/api.js'
import errorHandlerMiddleware from './middleware/errorHandler.js'
import notFoundMiddleware from './middleware/notFound.js'
import { connectDB } from './config/mongo.js'

const requiredEnvVars = ['MONGO_URI', 'IUCN_TOKEN', 'GLOBALGIVING_TOKEN', 'DATABASE_URL']
for (const key of requiredEnvVars) {
    if (!process.env[key]) throw new Error(`Missing environment variable: ${key}`)
}

const app = express()

app.use(express.json())
app.use('/api', apiRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const PORT = process.env.PORT || 5000

const start = async () => {
    try {
        await connectDB()
        app.listen(PORT, () => {
            console.log(`API listening on http://localhost:${PORT}`)
        })
    } catch (error) {
        console.error('Failed to start server:', error.message)
        process.exit(1)
    }
}

start()
