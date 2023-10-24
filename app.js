require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()
const connectDB = require('./db/connect')
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')

const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swagger.yaml')

const authMiddleware = require('./middleware/authentication')
const errorHandlerMiddleware = require('./middleware/error-handler')
const notFoundMiddleware = require('./middleware/not-found')
const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')

app.use(express.json())

app.set('trust proxy', 1)
// app.use(
//   rateLimiter({
//     windowMs: 15 * 60 * 4 * 1000,
//     limit: 100,
//   })
// )

app.use(helmet())
app.use(cors())
app.use(xss())

app.get('/', (req, res) => {
  res.send('<h1>Jobs API</h1><a href="/api-docs">API Documentation</a>')
})

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authMiddleware, jobsRouter)

app.use(errorHandlerMiddleware)
app.use(notFoundMiddleware)

const port = process.env.PORT || 3000

const start = async () => {
  await connectDB(process.env.MONGO_URI)
  app.listen(port, () => console.log(`Server is listening on port ${port}...`))
}

start()
