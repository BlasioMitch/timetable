const express = require ('express')
const cors = require('cors')

const server = express()
require('dotenv').config()
const Subject = require('./models/subject')
const Teacher = require('./models/teacher')


let teachers = []
let subjects = []
Teacher.find({}).then(tea => tea.forEach(t => teachers=teachers.concat(tea)))
Subject.find({}).then(sub => sub.forEach(s => subjects=subjects.concat(sub)))

const requestLogger = (request, response, next) => {
    console.log('   Method: ',request.method)
    console.log('   Path: ', request.path)
    console.log('   Body: ', request.body)
    console.log('------------------------')
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
server.use(cors())
server.use(express.json())
server.use(requestLogger)
server.use(express.static('build'))



// first route
server.get('/', (request, response) => {
    response.send(`
    <div>
    <h1>WELCOME TO THE TIMETABLE APP</h1>
    <h2>Feel at home</h2>
    </div>
    `)
})
// Fetching teachers
server.get('/api/teachers',(request, response, next) => {
    Teacher.find({})
        .then(teachers => {
            console.log('All teachers fetched')
            response.json(teachers)
        }).catch(err => next(err))
})

// Fetching subjects
server.get('/api/subjects',(request, response) => {
    Subject.find({})
        .then(subjects => {
            console.log("All subjects fetched")
            response.json(subjects)
        })
})

// Fetchig teacher by ID
server.get('/api/teachers/:id', (request, response, next) => {
    Teacher.findById(request.params.id)
        .then(teacher => {
            if(teacher){
                response.json(teacher)
            }else{
                response.status(404).end()
            }
        })
        .catch(err => next(err))
})

// Fetching Subject by ID
server.get('/api/subjects/:id', (request, response,next) => {
    Subject.findById(request.params.id)
        .then(subject => {
            if(subject){
                response.json(subject)
            }else{
                response.status(404).end()
            }
        })
        .catch(err => next(err))
})

// Deletig a  teacher
server.delete('/api/teachers/:id', (request, response, next) => {
    Teacher.findByIdAndDelete(request.params.id)
        .then(() => response.status(204).end())
        .catch(err => next(err))
})

// Deleting a Subject
server.delete('/api/subjects/:id', (request, response, next) => {
    Subject.findByIdAndDelete(request.params.id)
        .then(() => response.status(204).end())
        .catch(err => next(err))
})

// Creating a teacher
server.post('/api/teachers', (request, response, next) => {
    const teacher = request.body
    if (teachers.find(t => t.name === teacher.name)){
        return response.status(400).json({
            error:`${teacher.name} exists`
        })
    }else{
        const newTeacher = new Teacher({
            _id:teacher.id,
            name:teacher.name,
            code:teacher.code
        })
        newTeacher.save().then(tn => {
            console.log('saved ',tn.name)
            response.json(tn)
        }).catch(err => next(err))
    }

})

// Creating a subject
server.post('/api/subjects',(request, response, next) => {
    const subject = request.body
    if (subjects.find(s => s.name === subject.name)){
        return response.status(400).json({
            error: `${subject.name} exists`
        })
    }else{
        const newSubject = new Subject({
            _id:subject.id,
            name:subject.name,
            code:subject.code
        })
        newSubject.save().then(sn => {
            console.log(`saved ${sn.name}`)
            response.json(sn)
        }).catch(err => next(err))
    }
})

// Updating a Teacher
server.put('/api/teachers/:id', (request, response, next) =>{
    const { name, code } = request.body
    Teacher.findByIdAndUpdate(
        request.params.id,
        { name,code },
        { new: true, runValidators: true, context:'query' }
    ).then(updatedTeacher =>{
        response.json(updatedTeacher)
    }).catch(err => next(err))
})

// Updating a Subject
server.put('api/subjects/:id', (request, response, next) => {
    const { name, code } = request.body
    Subject.findByIdAndUpdate(
        request.params.id,
        { name,code },
        { new: true, runValidators: true, context:'query' }
    ).then(updatedSubject =>{
        response.json(updatedSubject)
    }).catch(err => next(err))
})

server.use(unknownEndpoint)
server.use(errorHandler)

const PORT = process.env.PORT || 3001
server.listen(PORT, () =>{
    console.log(`Server running on Port: ${PORT}`)
})
