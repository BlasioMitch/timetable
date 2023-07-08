// ******* Connecting to the mondoDB database**********************
// import mongoose
const mongoose = require('mongoose')


const url = process.env.MONGODB_URI
mongoose.set('strictQuery',false)

console.log('connecting to MongoDB...')

mongoose.connect(url)
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch((error) => {
        console.log('Error connecting to MOongoDB: ', error.message)
    })

// create a schema for your documents as a template
const subjectSchema = new mongoose.Schema({
    _id:Number,
    name:{
        type: String,
        minLength: 2,
        required: true
    },
    code:{
        type: String,
        minLength: 2,
        required: true
    }
})

subjectSchema.set('toJSON',{
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Subject',subjectSchema)