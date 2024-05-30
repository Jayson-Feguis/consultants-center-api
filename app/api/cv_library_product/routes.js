import express from "express";
import { getCVLibraryProducts, createCVLibraryProducts, updateCVLibraryProducts, deleteCVLibraryProducts } from "./controller.js";
import { auth, dbConnection, isHR } from "../../lib/middleware.js";

const endpoint = "/api/cv-library-products"
const router = express.Router();

/**
 * GET - Retrieves all products in cv library.
 * @requires Bearer_Token - Requires authentication.
 */
router.get(endpoint, auth, dbConnection, isHR, getCVLibraryProducts);

router.post(endpoint, auth, dbConnection, isHR, createCVLibraryProducts);

router.put(`${endpoint}/:id`, auth, dbConnection, isHR, updateCVLibraryProducts);

router.delete(`${endpoint}/:id`, auth, dbConnection, isHR, deleteCVLibraryProducts);

export default router;