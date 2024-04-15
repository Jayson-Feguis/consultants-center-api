import express from "express";
import { checkIn, checkOut, getLocationLogByMonth, getCurrentLocationLog } from "./controller.js";
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

export default router;