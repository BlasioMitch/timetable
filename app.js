const config = require('./utils/config')
const express = require ('express')
const server = express()
const cors = require('cors')

const teacherRouter = require('./controllers/teachers')
const subjectRouter = require('./controllers/subjects')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

logger.info('connecting to ', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('Connected to MongoDB')
    })
    .catch(error => {
        logger.error('Error connecting: ', error.message)
    })

// let teachers = []
// let subjects = []
// Teacher.find({}).then(tea => tea.forEach(t => teachers=teachers.concat(tea)))
// Subject.find({}).then(sub => sub.forEach(s => subjects=subjects.concat(sub)))

server.use(cors())
server.use(express.static('build'))
server.use(express.json())
server.use(middleware.requestLogger)
server.use('/api/teachers', teacherRouter)
server.use('/api/subjects', subjectRouter)
server.use(middleware.unknownEndpoint)
server.use(middleware.errorHandler)

module.exports = server