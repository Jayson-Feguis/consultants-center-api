import express from "express";
import { checkIn } from "./controller.js";
import { auth, dbConnection } from "../../lib/middleware.js";
import multer from "multer";

const endpoint = "/api/dtr"
const router = express.Router();

/**
 * GET - Retrieves dtr.
 * @requires Bearer_Token - Requires authentication.
 */

router.post(endpoint, auth, dbConnection, multer().none(), checkIn);

export default router;