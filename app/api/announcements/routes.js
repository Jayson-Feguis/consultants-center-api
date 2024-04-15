import express from "express";
import { getAnnouncements, createAnnouncements, updateAnnouncements, deleteAnnouncements, getActiveAnnouncements } from "./controller.js";
import { auth, dbConnection, isHR, uploadImage } from "../../lib/middleware.js";

const endpoint = "/api/announcements"
const router = express.Router();

/**
 * GET - Retrieves all announcements.
 * @requires Bearer_Token - Requires authentication.
 */
router.get(endpoint, auth, isHR, dbConnection, getAnnouncements);

router.get(`${endpoint}/active`, getActiveAnnouncements);

router.post(endpoint, auth, isHR, dbConnection, uploadImage.single('file'), createAnnouncements);

router.put(`${endpoint}/:id`, auth, isHR, dbConnection, uploadImage.single('file'), updateAnnouncements);

router.delete(`${endpoint}/:id`, auth, isHR, dbConnection, deleteAnnouncements);

export default router;