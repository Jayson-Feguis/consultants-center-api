import express from "express";
import { getAnnouncementsCustomPerAnnouncementId } from "./controller.js";
import { auth, dbConnection } from "../../lib/middleware.js";

const endpoint = "/api/announcements-custom"
const router = express.Router();

/**
 * GET - Retrieves all announcements custom.
 * @requires Bearer_Token - Requires authentication.
 */

router.get(`${endpoint}/:announcementId`, auth, dbConnection, getAnnouncementsCustomPerAnnouncementId);

export default router;