import express from "express";
import { getTickets, createTickets, updateTickets, deleteTickets } from "./controller.js";
import { auth, dbConnection, isHR } from "../../lib/middleware.js";

const endpoint = "/api/tickets"
const router = express.Router();

/**
 * GET - Retrieves all tickets.
 * @requires Bearer_Token - Requires authentication.
 */
router.get(endpoint, auth, dbConnection, isHR, getTickets);

router.post(endpoint, auth, dbConnection, isHR, createTickets);

router.put(`${endpoint}/:id`, auth, dbConnection, isHR, updateTickets);

router.delete(`${endpoint}/:id`, auth, dbConnection, isHR, deleteTickets);

export default router;