const appointmentModel = require('../models/appointmentModel')
const commentModel = require('../models/commentModel')
const doctorModel = require('../models/doctorModel')
const reportModel = require('../models/reportModel')
const userModel = require('../models/reportModel')

const getDoctorInfoController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ userId: req.body.userId })
        res.status(200).send({
            success: true,
            message: 'Doctor data fetch success',
            data: doctor
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error in Fetching Doctor Details'
        })
    }
}

// update doc profile
const updateProfileController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOneAndUpdate({ userId: req.body.userId }, req.body)
        res.status(201).send({
            success: true,
            message: 'Doctor Profile Updated',
            data: doctor,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Doctor Profile Update Issue'
        })
    }
}

// get single doctor
const getDoctorByIdController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ _id: req.body.doctorId })
        res.status(200).send({
            success: true,
            message: 'Single Doctor Info Fetched',
            data: doctor
        })
    } catch (error) {
        console.log(error)
        res.success(500).send({
            success: false,
            error,
            message: 'Error in Single Doctor Info'
        })
    }
}

// doctor Appointments Controller
const doctorAppointmentsController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ userId: req.body.userId })
        const appointments = await appointmentModel.find({
            doctorId: doctor._id,
        })
        res.status(200).send({
            success: true,
            message: 'Doctor Appointments fetch Successfully',
            data: appointments,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error in Doc Appointments'
        })
    }
}


const updateStatusController = async (req, res) => {
    try {
        const { appointmentsId, status } = req.body
        const appointments = await appointmentModel.findByIdAndUpdate(appointmentsId, { status })
        const user = await userModel.findOne({ _id: appointments.userId })
        const notification = user.notification;
        notification.push({
            type: 'Status updated',
            message: `Appointment has been updated ${status}`,
            onClickPath: '/doctor-appointments'
        })
        await user.save()
        res.status(200).send({
            success: true,
            message: "Appointment Status updated"
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error In updata status'
        })
    }

}


const patientReportController = async (req, res) => {
    const patientId = req.body.data.patientId;
    try {

        const report = await reportModel.find({ userId: patientId })
        //console.log("report data", report)
        res.status(200).send({
            success: true,
            message: 'Report data fetch successfully',
            data: report,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error in fetching report'
        })
    }

}

const commentController = async (req, res) => {
    try {
        console.log(req.body);
        const newComment = await commentModel({ ...req.body })
        await newComment.save()
        res.status(201).send({
            success: true,
            message: 'Succefully Commented'
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Not successfully pass comment'
        })
    }
}


module.exports = {
    getDoctorInfoController,
    updateProfileController,
    getDoctorByIdController,
    doctorAppointmentsController,
    updateStatusController,
    patientReportController,
    commentController
}

