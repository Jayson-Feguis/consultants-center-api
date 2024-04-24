import express from "express";
import { uploadSingleFile } from "./controller.js";
import { auth, dbConnection } from "../../lib/middleware.js";
import multer from "multer";

const endpoint = "/api/medias"
const router = express.Router();

/**
 * POST - Upload file to medias.
 * @requires Bearer_Token - Requires authentication.
 */
router.post(endpoint, auth, dbConnection, multer().single('file'), uploadSingleFile);

export default router;