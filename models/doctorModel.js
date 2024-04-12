const mongoose = require('mongoose')

const doctorSchema = new mongoose.Schema({
    userId: {
        type: String
    },
    firstName: {
        type: String,
        required: [true, ' first name is required']
    },
    lastName: {
        type: String,
        required: [true, 'last name is required']
    },
    phone: {
        type: String,
        required: [true, 'phone no. is required']
    },
    email: {
        type: String,
        required: [true, 'email is required']
    },
    website: {
        type: String,
    },
    address: {
        type: String,
        require: [true, 'address is required']
    },
    specialization: {
        type: String,
        require: [true, 'specialization is required']
    },
    experience: {
        type: String,
        require: [true, 'experience is required']
    },
    feesPerCunsaltation: {
        type: Number,
        require: [true, 'feesPerCunsaltation is required']
    },
    status: {
        type: String,
        default: 'pending'
    },
    timings: {
        type: Object,
        require: [true, 'work timing is required']
    },
    endTime: {
        type: Object,
        require: [true, 'End timing is required']
    }
}, { timestamps: true }
)

const doctorModel = mongoose.model('doctors', doctorSchema)
module.exports = doctorModel