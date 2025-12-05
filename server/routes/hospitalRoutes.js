import express from "express";
import { protectFacility } from "../middlewares/facilityMiddleware.js";
import {
  hospitalRequestBlood,
  getHospitalRequests,
  getHospitalDashboard,
  getHospitalStock,
  getHospitalHistory,
  getAllDonors,
  logContactAttempt,
  createExternalBloodRequest
} from "../controllers/hospitalController.js";

const router = express.Router();

// Blood request routes for hospitals
router.post("/blood/request", protectFacility, hospitalRequestBlood);
router.post("/external-blood-request", protectFacility, createExternalBloodRequest);
router.get("/blood/requests", protectFacility, getHospitalRequests);

// Dashboard routes
router.get("/dashboard", protectFacility, getHospitalDashboard);
router.get("/blood/stock", protectFacility, getHospitalStock);
router.get("/history", protectFacility, getHospitalHistory);

// Add to bloodLabRoutes.js
router.get("/donors", protectFacility, getAllDonors);
router.post("/donors/:id/contact", protectFacility, logContactAttempt);

export default router;