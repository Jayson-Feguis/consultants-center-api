import express from "express";
import { getTickets, createTickets, updateTickets, deleteTickets } from "./controller.js";
import { auth, dbConnection } from "../../lib/middleware.js";

const endpoint = "/api/tickets"
const router = express.Router();

/**
 * GET - Retrieves all tickets.
 * @requires Bearer_Token - Requires authentication.
 */
router.get(endpoint, auth, dbConnection, getTickets);

router.post(endpoint, auth, dbConnection, createTickets);

router.put(`${endpoint}/:t_id`, auth, dbConnection, updateTickets);

router.delete(`${endpoint}/:id`, auth, dbConnection, deleteTickets);

export default router;