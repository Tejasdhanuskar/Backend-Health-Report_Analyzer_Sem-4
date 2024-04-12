const express = require("express")
const { loginController,
    registerController,
    authController,
    applyDoctorController,
    getAllNotificationController,
    deleteAllNotificationController,
    getAllDoctorsController,
    bookAppointmentController,
    bookingAvailabilityController,
    userAppointmentsController,
    userReportController,
    userCommentController } = require("../controllers/userCtrl")
const authMiddleware = require("../middlewares/authMiddleware")

//router object
const router = express.Router()

//routes
//LOGIN || POST
router.post('/login', loginController)

//REGISTER || POST
router.post('/register', registerController)

//Auth || POST
router.post('/getUserData', authMiddleware, authController)

//Apply Doctor || POST
router.post('/apply-doctor', authMiddleware, applyDoctorController)

//Notification || POST
router.post('/get-all-notification', authMiddleware, getAllNotificationController)

//Delete Notification || POST
router.post('/delete-all-notification', authMiddleware, deleteAllNotificationController)

//GET ALL DOCTOR
router.get('/getAllDoctors', authMiddleware, getAllDoctorsController)

// BOOK APPOINTMENT
router.post('/book-appointment', authMiddleware, bookAppointmentController)

// Booking Availability 
router.post('/booking-availability', authMiddleware, bookingAvailabilityController)

// Appointments List
router.get('/user-appointments', authMiddleware, userAppointmentsController)

// Image Data
router.post('/report-data', authMiddleware, userReportController)

// Comment List
router.get('/user-comment', authMiddleware, userCommentController)

module.exports = router;