import express from "express";
import { getOvertimes, createOvertimes, updateOvertimes, deleteOvertimes, getMyOvertimes, getMyOvertimesDashboard, approveAll, approve, getOvertimesApprover } from "./controller.js";
import { auth, dbConnection, isApprover } from "../../lib/middleware.js";
import multer from "multer";

const endpoint = "/api/overtimes"
const router = express.Router();

/**
 * GET - Retrieves all overtime.
 * @requires Bearer_Token - Requires authentication.
 */
router.get(endpoint, auth, dbConnection, getOvertimes);

router.get(`${endpoint}/user`, auth, dbConnection, getMyOvertimes);

router.get(`${endpoint}/dashboard`, auth, dbConnection, getMyOvertimesDashboard);

router.get(`${endpoint}/approver`, auth, dbConnection, isApprover, getOvertimesApprover);

router.post(endpoint, auth, dbConnection, createOvertimes);

router.put(`${endpoint}/:lot_id`, auth, dbConnection, updateOvertimes);

router.delete(`${endpoint}/:id`, auth, dbConnection, deleteOvertimes);

router.patch(`${endpoint}/approve-all/:status`, auth, dbConnection, multer().none(), isApprover, approveAll); // approve all or reject all

router.patch(`${endpoint}/approve/:status`, auth, dbConnection, multer().none(), isApprover, approve);

export default router;