import express from "express";
import { checkIn, checkOut, getLocationLogByMonth, getCurrentLocationLog, updateLogAdjustment, getLocationLogAdjustments, approveAll, approve, getLocationLogByDates } from "./controller.js";
import { auth, dbConnection, isApprover } from "../../lib/middleware.js";
import multer from "multer";

const endpoint = "/api/location-logs"
const router = express.Router();

/**
 * GET - Retrieves dtr.
 * @requires Bearer_Token - Requires authentication.
 */

router.get(`${endpoint}/:year/:month`, auth, dbConnection, getLocationLogByMonth);

router.get(`${endpoint}/checkedin/date/:date`, auth, dbConnection, getLocationLogByDates);

router.get(`${endpoint}/current`, auth, dbConnection, getCurrentLocationLog);

router.get(`${endpoint}/adjustments`, auth, dbConnection, isApprover, getLocationLogAdjustments);

router.post(endpoint, auth, dbConnection, multer().none(), checkIn);

router.patch(endpoint, auth, dbConnection, multer().none(), checkOut);

router.patch(`${endpoint}/log-adjustment/:id`, auth, dbConnection, multer().none(), updateLogAdjustment);

router.patch(`${endpoint}/approve-all/:status`, auth, dbConnection, multer().none(), isApprover, approveAll); // approve all or reject all

router.patch(`${endpoint}/approve/:status`, auth, dbConnection, multer().none(), isApprover, approve);

export default router;