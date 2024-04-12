const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema({
    patientId: {
        type: String,
        required: true
    },
    doctorId: {
        type: String,
        required: true
    },
    description: {
        type: String,

    },
    date: {
        type: String,

    }
}, { timestamps: true })

const commentModel = mongoose.model('comment', commentSchema)

module.exports = commentModel;