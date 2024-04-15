import express from "express";
import { getAnnouncements, getAnnouncementsByUserId, createAnnouncements, updateAnnouncements, deleteAnnouncements } from "./controller.js";
import { auth, dbConnection, uploadImage } from "../../lib/middleware.js";

const endpoint = "/api/announcements-per-db"
const router = express.Router();

/**
 * GET - Retrieves all announcements per database.
 * @requires Bearer_Token - Requires authentication.
 */
router.get(endpoint, auth, dbConnection, getAnnouncements);

router.get(`${endpoint}/user`, auth, dbConnection, getAnnouncementsByUserId);

router.post(endpoint, auth, dbConnection, uploadImage.single('file'), createAnnouncements);

router.put(`${endpoint}/:id`, auth, dbConnection, uploadImage.single('file'), updateAnnouncements);

router.delete(`${endpoint}/:id`, auth, dbConnection, deleteAnnouncements);

export default router;