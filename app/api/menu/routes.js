import express from "express";
import { getMenusPerUser, getAllMenus, createMenus, updateMenus, deleteMenus } from "./controller.js";
import { auth, dbConnection } from "../../lib/middleware.js";
import multer from "multer";

const endpoint = "/api/menus"
const router = express.Router();

/**
 * GET - Retrieves all menus.
 * @requires Bearer_Token - Requires authentication.
 */
router.get(`${endpoint}/user`, auth, dbConnection, getMenusPerUser);

router.get(endpoint, auth, dbConnection, getAllMenus);

router.post(endpoint, auth, dbConnection, multer().none(), createMenus);

router.put(`${endpoint}/:id`, auth, dbConnection, multer().none(), updateMenus);

router.delete(`${endpoint}/:id`, auth, dbConnection, multer().none(), deleteMenus);

export default router;