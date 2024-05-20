import express from "express";
import { getLeaves, createLeaves, updateLeaves, deleteLeaves, getMyLeaves, approveAll, approve, getLeavesApprover, getMyLeavesDashboard } from "./controller.js";
import { auth, dbConnection, isApprover } from "../../lib/middleware.js";
import multer from "multer";

const endpoint = "/api/leaves"
const router = express.Router();

/**
 * GET - Retrieves all leave.
 * @requires Bearer_Token - Requires authentication.
 */
router.get(endpoint, auth, dbConnection, getLeaves);

router.get(`${endpoint}/user`, auth, dbConnection, getMyLeaves);

router.get(`${endpoint}/dashboard`, auth, dbConnection, getMyLeavesDashboard);

router.get(`${endpoint}/approver`, auth, dbConnection, isApprover, getLeavesApprover);

router.post(endpoint, auth, dbConnection, createLeaves);

router.put(`${endpoint}/:l_id`, auth, dbConnection, updateLeaves);

router.delete(`${endpoint}/:id`, auth, dbConnection, deleteLeaves);

router.patch(`${endpoint}/approve-all/:status`, auth, dbConnection, multer().none(), isApprover, approveAll); // approve all or reject all

router.patch(`${endpoint}/approve/:status`, auth, dbConnection, multer().none(), isApprover, approve);

export default router;