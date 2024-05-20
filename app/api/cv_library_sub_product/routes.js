import express from "express";
import { getCVLibrarySubProducts, createCVLibrarySubProducts, updateCVLibrarySubProducts, deleteCVLibrarySubProducts } from "./controller.js";
import { auth, dbConnection, isHR } from "../../lib/middleware.js";

const endpoint = "/api/cv-library-sub-products"
const router = express.Router();

/**
 * GET - Retrieves all sub products in cv library.
 * @requires Bearer_Token - Requires authentication.
 */
router.get(endpoint, auth, dbConnection, isHR, getCVLibrarySubProducts);

router.post(endpoint, auth, dbConnection, isHR, createCVLibrarySubProducts);

router.put(`${endpoint}/:id`, auth, dbConnection, isHR, updateCVLibrarySubProducts);

router.delete(`${endpoint}/:id`, auth, dbConnection, isHR, deleteCVLibrarySubProducts);

export default router;