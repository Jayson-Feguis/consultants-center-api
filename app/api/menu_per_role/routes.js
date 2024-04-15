import express from "express";
import { getAllMenusPerRole, createMenusPerRole, updateMenusPerRole, deleteMenusPerRole } from "./controller.js";
import { auth, dbConnection } from "../../lib/middleware.js";
import multer from "multer";

const endpoint = "/api/menus-per-role"
const router = express.Router();

/**
 * GET - Retrieves all menus per role.
 * @requires Bearer_Token - Requires authentication.
 */

router.get(endpoint, auth, dbConnection, getAllMenusPerRole);

router.post(endpoint, auth, dbConnection, multer().none(), createMenusPerRole);

router.put(`${endpoint}/:role`, auth, dbConnection, multer().none(), updateMenusPerRole);

router.delete(`${endpoint}/:role`, auth, dbConnection, multer().none(), deleteMenusPerRole);

export default router;