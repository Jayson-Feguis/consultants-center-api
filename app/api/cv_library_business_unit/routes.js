import express from "express";
import { getCVLibraryBusinessUnits, createCVLibraryBusinessUnits, updateCVLibraryBusinessUnits, deleteCVLibraryBusinessUnits } from "./controller.js";
import { auth, dbConnection, isHR } from "../../lib/middleware.js";

const endpoint = "/api/cv-library-business-units"
const router = express.Router();

/**
 * GET - Retrieves all hiring source in cv library.
 * @requires Bearer_Token - Requires authentication.
 */
router.get(endpoint, auth, dbConnection, isHR, getCVLibraryBusinessUnits);

router.post(endpoint, auth, dbConnection, isHR, createCVLibraryBusinessUnits);

router.put(`${endpoint}/:id`, auth, dbConnection, isHR, updateCVLibraryBusinessUnits);

router.delete(`${endpoint}/:id`, auth, dbConnection, isHR, deleteCVLibraryBusinessUnits);

export default router;