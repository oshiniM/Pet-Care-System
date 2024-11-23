const express = require("express");
const {
  getDoctorInfoController,
  updateProfileController,
  getDoctorByIdController,
  doctorAppointmentsController,
  updateStatusController,
  deleteDoctor,
} = require("../controllers/doctorCtrl");
const protect = require("../middleWare/authMiddleware");
// const authMiddleware = require("../middleWare/authMiddleware");
const router = express.Router();

// Delete Doctor
router.delete("/:id", deleteDoctor);

//POST SINGLE DOC INFO
// router.post("/getDoctorInfo", getDoctorInfoController);
router.get("/doctorInfo", protect, getDoctorInfoController);


//POST UPDATE PROFILE
router.post("/updateProfile", updateProfileController);

//POST  GET SINGLE DOC INFO
router.post("/getDoctorById", getDoctorByIdController);

//GET Appointments
router.get(
  "/doctor-appointments",
  
  doctorAppointmentsController
);

//POST Update Status
router.post("/update-status", updateStatusController);

module.exports = router;
