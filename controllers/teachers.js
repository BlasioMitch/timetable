const teacherRouter = require('express').Router()

const Teacher = require('../models/teacher')

teacherRouter.get('/timetable', (request, response) => {
    response.send(`
    <div>
    <h1>WELCOME TO THE TIMETABLE APP</h1>
    <h2>Feel at home</h2>
    </div>
    `)
})
// Fetching teachers
teacherRouter.get('/',(request, response, next) => {
    Teacher.find({})
        .then(teachers => {
            console.log('All teachers fetched')
            response.json(teachers)
        }).catch(err => next(err))
})


// Fetchig teacher by ID
teacherRouter.get('/:id', (request, response, next) => {
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

// Deletig a  teacher
teacherRouter.delete('/:id', (request, response, next) => {
    Teacher.findByIdAndDelete(request.params.id)
        .then(() => response.status(204).end())
        .catch(err => next(err))
})

// Creating a teacher
teacherRouter.post('/', (request, response, next) => {
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

// Updating a Teacher
teacherRouter.put('/:id', (request, response, next) =>{
    const { name, code } = request.body
    Teacher.findByIdAndUpdate(
        request.params.id,
        { name,code },
        { new: true, runValidators: true, context:'query' }
    ).then(updatedTeacher =>{
        response.json(updatedTeacher)
    }).catch(err => next(err))
})

module.exports = teacherRouter