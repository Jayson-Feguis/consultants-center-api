import express from "express";
import { getCVLibraryPrincipals, createCVLibraryPrincipals, updateCVLibraryPrincipals, deleteCVLibraryPrincipals } from "./controller.js";
import { auth, dbConnection, isHR } from "../../lib/middleware.js";

const endpoint = "/api/cv-library-principals"
const router = express.Router();

/**
 * GET - Retrieves all principals in cv library.
 * @requires Bearer_Token - Requires authentication.
 */
router.get(endpoint, auth, dbConnection, isHR, getCVLibraryPrincipals);

router.post(endpoint, auth, dbConnection, isHR, createCVLibraryPrincipals);

router.put(`${endpoint}/:id`, auth, dbConnection, isHR, updateCVLibraryPrincipals);

router.delete(`${endpoint}/:id`, auth, dbConnection, isHR, deleteCVLibraryPrincipals);

export default router;