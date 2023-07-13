const logger = require('./logger')

const requestLogger = (request, response, next) => {
    logger.info('   Method: ',request.method)
    logger.info('   Path: ', request.path)
    logger.info('   Body: ', request.body)
    logger.info('------------------------')
    next()  
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({Error:"Unknown endpoint used"})
}

const errorHandler = (error, request, response, next) => {
    if (error.name === "MongooseError"){
        return response.status(400).send({error:error.message})
    }else if (error.name === 'CastError'){
        return response.status(400).send({error:"Malformatted ID used"})
    } else if (error.name === 'ValidationError'){
        return response.status(400).send({error:error.message})
    } else if (error.name === 'ReferenceError'){
        return response.status(500).send({error:error.message})
    }
    next()
}

module.exports = { requestLogger, unknownEndpoint, errorHandler }