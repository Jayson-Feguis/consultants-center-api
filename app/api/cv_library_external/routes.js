import express from "express";
import { getCVLibraryExternals, createCVLibraryExternals, updateCVLibraryExternals, deleteCVLibraryExternals } from "./controller.js";
import { auth, dbConnection, isHR, uploadFiles } from "../../lib/middleware.js";

const endpoint = "/api/cv-library-externals"
const router = express.Router();

/**
 * GET - Retrieves all external cv in cv library.
 * @requires Bearer_Token - Requires authentication.
 */
router.get(endpoint, auth, dbConnection, isHR, getCVLibraryExternals);

router.post(endpoint, auth, dbConnection, isHR, uploadFiles.fields([{ name: 'singleFile', maxCount: 1 }, { name: 'multipleFile', maxCount: 5 }]), createCVLibraryExternals);

router.put(`${endpoint}/:id`, auth, dbConnection, isHR, uploadFiles.fields([{ name: 'singleFile', maxCount: 1 }, { name: 'multipleFile', maxCount: 5 }]), updateCVLibraryExternals);

router.delete(`${endpoint}/:id`, auth, dbConnection, isHR, deleteCVLibraryExternals);

export default router;