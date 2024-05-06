const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const { MONGODB_URI } = require('./utils/config')
const blogsRouter = require('./controllers/blogs')
const { morganLogger } = require('./utils/middleware')
const logger = require('./utils/logger')

mongoose.set('strictQuery', false)

mongoose
  .connect('MONGODB_URI')
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

app.use('/api/blogs', blogsRouter)

module.exports = app
