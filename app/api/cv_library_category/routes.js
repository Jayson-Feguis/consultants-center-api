import express from "express";
import { getCVLibraryCategories, getCVLibraryCategoriesForModule, createCVLibraryCategories, updateCVLibraryCategories, deleteCVLibraryCategories, getCVLibraryCategoriesForPrincipal, getCVLibraryCategoriesForProduct, getCVLibraryCategoriesForSubProduct, getCVLibraryCategoriesForBusinessUnit, createCVLibraryCategoriesImport } from "./controller.js";
import { auth, dbConnection, isHR, uploadFiles } from "../../lib/middleware.js";

const endpoint = "/api/cv-library-categories"
const router = express.Router();

/**
 * GET - Retrieves all categories in cv library.
 * @requires Bearer_Token - Requires authentication.
 */
router.get(endpoint, auth, dbConnection, isHR, getCVLibraryCategories);

router.get(`${endpoint}/for-business-unit`, auth, dbConnection, isHR, getCVLibraryCategoriesForBusinessUnit);

router.get(`${endpoint}/for-module`, auth, dbConnection, isHR, getCVLibraryCategoriesForModule);

router.get(`${endpoint}/for-principal`, auth, dbConnection, isHR, getCVLibraryCategoriesForPrincipal);

router.get(`${endpoint}/for-product`, auth, dbConnection, isHR, getCVLibraryCategoriesForProduct);

router.get(`${endpoint}/for-sub-product`, auth, dbConnection, isHR, getCVLibraryCategoriesForSubProduct);

router.post(endpoint, auth, dbConnection, isHR, createCVLibraryCategories);

router.post(`${endpoint}/import/:type`, auth, dbConnection, isHR, uploadFiles.fields([{ name: 'singleFile', maxCount: 1 }]), createCVLibraryCategoriesImport);

router.put(`${endpoint}/:id`, auth, dbConnection, isHR, updateCVLibraryCategories);

router.delete(`${endpoint}/:id`, auth, dbConnection, isHR, deleteCVLibraryCategories);

export default router;