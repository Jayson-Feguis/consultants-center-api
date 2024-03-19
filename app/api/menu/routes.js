import express from "express";
import { getAllMenus } from "./controller.js";
import { auth } from "../../lib/middleware.js";

const endpoint = "/api/menus"
const router = express.Router();

/**
 * GET - Retrieves all menus.
 * @requires Bearer_Token - Requires authentication.
 */
router.get(endpoint, auth, getAllMenus);

export default router;