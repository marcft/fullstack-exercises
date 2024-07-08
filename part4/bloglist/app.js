const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('express-async-errors')

const { MONGODB_URI } = require('./utils/config')
const loginRouter = require('./controllers/login')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const testingRouter = require('./controllers/testing')
const {
  morganLogger,
  tokenExtractor,
  unknownEndpoint,
  errorHandler,
} = require('./utils/middleware')
const logger = require('./utils/logger')

mongoose.set('strictQuery', false)

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB')
  })
  .catch((error) => {
    logger.error('Error connecting to MongoDB:', error.message)
  })

const app = express()
app.use(cors())
app.use(express.json())
app.use(morganLogger)
app.use(tokenExtractor)

app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/blogs', blogsRouter)

if (process.env.NODE_ENV === 'test') {
  app.use('/api/testing', testingRouter)
}

app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app
