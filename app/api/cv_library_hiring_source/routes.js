import express from "express";
import { getCVLibraryHiringSources, createCVLibraryHiringSources, updateCVLibraryHiringSources, deleteCVLibraryHiringSources } from "./controller.js";
import { auth, dbConnection, isHR } from "../../lib/middleware.js";

const endpoint = "/api/cv-library-hiring-sources"
const router = express.Router();

/**
 * GET - Retrieves all hiring source in cv library.
 * @requires Bearer_Token - Requires authentication.
 */
router.get(endpoint, auth, dbConnection, isHR, getCVLibraryHiringSources);

router.post(endpoint, auth, dbConnection, isHR, createCVLibraryHiringSources);

router.put(`${endpoint}/:id`, auth, dbConnection, isHR, updateCVLibraryHiringSources);

router.delete(`${endpoint}/:id`, auth, dbConnection, isHR, deleteCVLibraryHiringSources);

export default router;