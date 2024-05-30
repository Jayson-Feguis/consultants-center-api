import express from "express";
import { getCVLibraryModules, createCVLibraryModules, updateCVLibraryModules, deleteCVLibraryModules } from "./controller.js";
import { auth, dbConnection, isHR } from "../../lib/middleware.js";

const endpoint = "/api/cv-library-modules"
const router = express.Router();

/**
 * GET - Retrieves all modules in cv library.
 * @requires Bearer_Token - Requires authentication.
 */
router.get(endpoint, auth, dbConnection, isHR, getCVLibraryModules);

router.post(endpoint, auth, dbConnection, isHR, createCVLibraryModules);

router.put(`${endpoint}/:id`, auth, dbConnection, isHR, updateCVLibraryModules);

router.delete(`${endpoint}/:id`, auth, dbConnection, isHR, deleteCVLibraryModules);

export default router;