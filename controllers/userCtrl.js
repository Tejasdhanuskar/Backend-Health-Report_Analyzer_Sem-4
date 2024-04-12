const userModel = require('../models/userModels')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const doctorModel = require('../models/doctorModel')
const appointmentModel = require('../models/appointmentModel');
const reportModel = require('../models/reportModel');
const moment = require('moment');
const { json } = require('express');

//register callback
const registerController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await userModel.findOne({ email })
        if (existingUser) {
            return res.status(200).send({ message: 'User Already Exist', success: false })
        }

        const salt = await bcrypt.genSalt(10)
        // make pass safe in using bcrypt and make it in the form of hash
        const hashedPassword = await bcrypt.hash(password, salt)
        req.body.password = hashedPassword
        const newUser = new userModel(req.body)
        await newUser.save()
        res.status(200).send({ message: 'Register Successfully', success: true });
    } catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: `Register Controller${error.message}` })
    }
};


//login call back
const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(200).send({ message: 'user not found', success: false })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(200).send({ message: ' Invalid Email or Password', success: false })
        }
        // to save the application safely we use jwt and token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" })
        res.status(200).send({ message: 'Login Success', success: true, token, user })
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: `Error in Login CTRL ${error.message}` })
    }
}

const authController = async (req, res) => {
    try {
        const user = await userModel.findById({ _id: req.body.userId })
        user.password = undefined
        if (!user) {
            return res.status(200).send({
                message: 'User Not Found',
                success: false
            })
        } else {
            res.status(200).send({
                success: true,
                data: user,
            });
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: 'auth error',
            success: false,
            error
        })
    }
};

//Apply Doctor
const applyDoctorController = async (req, res) => {
    try {
        console.log(req.body);
        const newDoctor = await doctorModel({ ...req.body, status: 'pending' })
        await newDoctor.save()
        const adminUser = await userModel.findOne({ isAdmin: true })
        const notification = adminUser.notification
        notification.push({
            type: 'apply-doctot-request',
            message: `${newDoctor.firstName} ${newDoctor.lastName} Has Applied for a Doctor Account`,
            data: {
                doctorId: newDoctor._id,
                name: newDoctor.firstName + " " + newDoctor.lastName,
                onClickPath: '/admin/doctors'
            }
        })
        await userModel.findByIdAndUpdate(adminUser._id, { notification })
        res.status(201).send({
            success: true,
            message: 'Doctor Account Applied Successfully'
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error While Applying For Doctor'
        })
    }
}

//notification ctrl
const getAllNotificationController = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.body.userId })
        const seennotification = user.seennotification
        const notification = user.notification
        seennotification.push(...notification)
        user.notification = []
        user.seennotification = notification
        const updatedUser = await user.save()
        res.status(200).send({
            success: true,
            message: 'all notification marked as read',
            data: updatedUser
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: 'Error in notification',
            success: false,
            error
        })
    }
}

//Delete notification

const deleteAllNotificationController = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.body.userId })
        user.notification = [];
        user.seennotification = [];
        const updatedUser = await user.save();
        updatedUser.password = undefined
        res.status(200).send({
            success: true,
            message: 'Notification Deleted successfully',
            data: updatedUser,
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'unable to delete all notification',
            error,
        })
    }
}

// get all doctor

const getAllDoctorsController = async (req, res) => {
    try {
        const doctors = await doctorModel.find({ status: "approved" });
        res.status(200).send({
            success: true,
            message: "Doctors Lists Fetched Successfully",
            data: doctors,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Errro WHile Fetching DOcotr",
        });
    }
};


//BOOK APPOINTMENT
const bookAppointmentController = async (req, res) => {
    try {
        req.body.date = moment(req.body.date, 'DD-MM-YYYY').toISOString()
        req.body.time = moment(req.body.time, "HH:mm").toISOString()
        req.body.status = "pending";
        const newAppointment = new appointmentModel(req.body);
        await newAppointment.save();
        const { _Id } = req.body;
        const user = await userModel.findOne({ _Id })
        user.notification.push({
            type: 'New-appointment-request',
            message: `A New Appointment Request from ${req.body.userInfo.name}`,
            onClickPath: '/user/appointments'
        })
        await user.save()
        res.status(200).send({
            success: true,
            message: 'Appointment Book Successfully'
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error While Booking Appointment'
        })
    }
}

// booking bookingAvailabilityController
const bookingAvailabilityController = async (req, res) => {
    try {
        const date = moment(req.body.date, 'DD-MM-YY').toISOString()
        const fromTime = moment(req.body.time, 'HH:mm').subtract(1, 'hours').toISOString()
        const toTime = moment(req.body.time, 'HH:mm').add(1, 'hours').toISOString()
        const selectedTime = moment(time, 'HH:mm');
        const doctorId = req.body.doctorId
        const appointments = await appointmentModel.find(doctorId, date, time)

        if (selectedTime.isBefore(fromTime) || selectedTime.isAfter(toTime)) {
            return res.status(200).send({
                message: 'Appointments not Available at this time',
                success: true
            })
        } else {
            return res.status(200).send({
                success: true,
                message: "Appointments available"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error In Booking'
        })
    }
}

//userAppointmentsController

const userAppointmentsController = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({ userId: req.body.userId })
        res.status(200).send({
            success: true,
            message: 'Users Appointments Fetch Successfully',
            data: appointments

        })
    } catch (error) {
        console.log(error)
        res.statu(500).send({
            success: false,
            error,
            message: 'Error In User Appointments'
        })
    }
}

// Report data
const userReportController = async (req, res) => {
    try {
        const { data, userId } = req.body;
        const { testName, testOne, testTwo, testThree } = data;
        //console.log(userId, testName, testOne, testTwo, testThree);
        console.log("1");
        let customerName = '';
        if (testOne.customerName === testTwo.customerName && testTwo.customerName === testThree.customerName) {
            customerName = testOne.customerName;
            delete testOne.customerName
            delete testTwo.customerName
            delete testThree.customerName;
            console.log("2");
        } else {
            console.log("3");
            return res.json({ status: "failed", message: "customer name should be same across all reposts" })

        }

        const response = await reportModel.create({ userId, customerName, testName, testOne, testTwo, testThree })
        if (response) {
            console.log("4");
            return res.json({ status: "ok", message: "report genration sucessful" });
        }

        return res.json({ status: "failed", message: "Something went wrong!" });
    } catch (error) {
        return res.status(500).json({ status: "failed", message: "Internal Server Error" })
    }
}

// doctor Appointments Controller
const userCommentController = async (req, res) => {
    try {
        const comment = await commentModel.find({ userId: req.body.userId })
        res.status(200).send({
            success: true,
            message: 'Comment fetch Successfully',
            data: comment,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error in comment'
        })
    }
}



module.exports = {
    loginController, registerController,
    authController, applyDoctorController
    , getAllNotificationController,
    deleteAllNotificationController,
    getAllDoctorsController,
    bookAppointmentController,
    bookingAvailabilityController,
    userAppointmentsController,
    userReportController,
    userCommentController
}