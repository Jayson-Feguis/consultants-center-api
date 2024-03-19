import express from "express";
import { allUsers, changePassword, changeProfile } from "./controller.js";
import { auth } from "../../lib/middleware.js";

const endpoint = "/api/users"
const router = express.Router();

router.get(endpoint, auth, allUsers);
router.patch(`${endpoint}/change-password`, auth, changePassword);
router.patch(`${endpoint}/change-profile`, auth, changeProfile);

export default router;