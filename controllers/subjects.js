const subjectRouter = require('express').Router()

const Subject = require('../models/subject')

subjectRouter.get('/timetable', (request, response) => {
    response.send(`
    <div>
    <h1>WELCOME TO THE TIMETABLE APP</h1>
    <h2>Feel at home</h2>
    </div>
    `)
})

// Fetching subjects
subjectRouter.get('/',(request, response) => {
    Subject.find({})
        .then(subjects => {
            console.log("All subjects fetched")
            response.json(subjects)
        })
})

// Fetching Subject by ID
subjectRouter.get('/:id', (request, response,next) => {
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

// Deleting a Subject
subjectRouter.delete('/:id', (request, response, next) => {
    Subject.findByIdAndDelete(request.params.id)
        .then(() => response.status(204).end())
        .catch(err => next(err))
})

// Creating a subject
subjectRouter.post('/',(request, response, next) => {
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


// Updating a Subject
subjectRouter.put('/:id', (request, response, next) => {
    const { name, code } = request.body
    Subject.findByIdAndUpdate(
        request.params.id,
        { name,code },
        { new: true, runValidators: true, context:'query' }
    ).then(updatedSubject =>{
        response.json(updatedSubject)
    }).catch(err => next(err))
})

module.exports = subjectRouter