import express from "express";
import { checkIn, checkOut, getLocationLogByMonth, getCurrentLocationLog, updateLogAdjustment } from "./controller.js";
import { auth, dbConnection } from "../../lib/middleware.js";
import multer from "multer";

const endpoint = "/api/location-logs"
const router = express.Router();

/**
 * GET - Retrieves dtr.
 * @requires Bearer_Token - Requires authentication.
 */

router.get(`${endpoint}/:year/:month`, auth, dbConnection, getLocationLogByMonth);

router.get(`${endpoint}/current`, auth, dbConnection, getCurrentLocationLog);

router.post(endpoint, auth, dbConnection, multer().none(), checkIn);

router.patch(endpoint, auth, dbConnection, multer().none(), checkOut);

router.patch(`${endpoint}/log-adjustment/:id`, auth, dbConnection, multer().none(), updateLogAdjustment);

export default router;