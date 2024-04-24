import express from "express";
import { getAllMenusPerUser, createMenusPerUser, updateMenusPerUser, deleteMenusPerUser } from "./controller.js";
import { auth, dbConnection } from "../../lib/middleware.js";
import multer from "multer";

const endpoint = "/api/menus-per-user"
const router = express.Router();

/**
 * GET - Retrieves all menus per role.
 * @requires Bearer_Token - Requires authentication.
 */

router.get(endpoint, auth, dbConnection, getAllMenusPerUser);

router.post(endpoint, auth, dbConnection, multer().none(), createMenusPerUser);

router.put(`${endpoint}/:userId`, auth, dbConnection, multer().none(), updateMenusPerUser);

router.delete(`${endpoint}/:userId`, auth, dbConnection, multer().none(), deleteMenusPerUser);

export default router;