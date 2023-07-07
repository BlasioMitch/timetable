const express = require ('express')
const cors = require('cors')

const server = express()
server.use(express.json())
server.use(cors())
server.use(express.static('build'))

let teachers = [
    {
        id:1,
        name:'Mtichell',
        code:'MI'
    },
    {
        id:2,
        name:'Nsimbi',
        code:'NS'
    },
    {
        id:3,
        name:'Blasio',
        code:'BL'
    }
]

let subjects = [
    {
        id:1,
        name:'Information and Communication Technology',
        code:'ICT'
    },
    {
        id:2,
        name:'Biology',
        code:'BIO'
    },
    {
        id:3,
        name:'Mathematics',
        code:'MATH'
    }
]

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

server.use(requestLogger)


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
server.get('/api/teachers',(request, response) => {
    console.log('All teachers fetched')
    response.json(teachers)
})

// Fetching subjects
server.get('/api/subjects',(request, response) => {
    response.json(subjects)
})

// Fetchig teacher by ID
server.get('/api/teachers/:id', (request, response) => {
    const teacher = teachers.find(t => t.id === Number(request.params.id))
    if (teacher){
        console.log(`${teacher} fetched`)
        response.json(teacher)
        
    } else{
        response.status(404).send({error:"Not Found"})
    }
})

// Fetching Subject by ID
server.get('/api/subjects/:id', (request, response) => {
    const subject = subjects.find(s => s.id === Number(request.params.id))
    if (subject){
        console.log(`${subject.name} fetched `)
        response.json(subject)
    }else{
        response.status(404).send({error:"Not found"})
    }
})

// Deletig a  teacher
server.delete('/api/teachers/:id', (request, response) => {
    teachers = teachers.filter(t => t.id !== Number(request.params.id))
    response.status(204).end()
})

// Deleting a Subject
server.delete('/api/subjects/:id', (request, response) => {
    subjects = subjects.filter(s => s.id !== Number(request.params.id))
    response.status(204).end()
})

// Creating a teacher
server.post('/api/teachers', (request, response) => {
    const teacher = request.body
    console.log(teacher)
    teachers = teachers.concat(teacher)
    response.json(teacher)
})

// Creating a subject
server.post('/api/subjects',(request, response) => {
    const subject = request.body
    console.log(subject)
    subjects = subjects.concat(subject)
    response.json(subject)
})

server.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
server.listen(PORT, () =>{
    console.log(`Server running on Port: ${PORT}`)
})
