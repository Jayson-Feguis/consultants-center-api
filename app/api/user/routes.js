import express from "express";
import { allUsers, changePassword, changeProfile, getUserForAnnouncement, getUsersById } from "./controller.js";
import { auth, dbConnection } from "../../lib/middleware.js";

const endpoint = "/api/users"
const router = express.Router();

router.get(endpoint, auth, allUsers);
router.get(`${endpoint}/announcement`, auth, dbConnection, getUserForAnnouncement);
router.get(`${endpoint}/:id`, auth, dbConnection, getUsersById);
router.patch(`${endpoint}/change-password`, auth, dbConnection, changePassword);
router.patch(`${endpoint}/change-profile`, auth, dbConnection, changeProfile);

export default router;