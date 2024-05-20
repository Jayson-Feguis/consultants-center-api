import { NotFoundError, transformResponse, ValidationError } from "../../lib/utils.js";
import { getTicket, createTicket, updateTicket, deleteTicket } from "./query.js";
import { validateCreateTicket, validateUpdateTicket } from "./validation.js";

export const getTickets = async (req, res) => {
  const tickets = await getTicket(req.dbconnection, req.query)

  res.status(200).json(transformResponse(tickets));
};

export const createTickets = async (req, res) => {
  await validateCreateTicket(req.body)

  const ticket = await createTicket(req.dbconnection, req.body)

  res.status(201).json(ticket);
};

export const updateTickets = async (req, res) => {
  await validateUpdateTicket({ ...req.params, ...req.body })
  const { title } = req.body
  const { id } = req.params

  const ticket = await updateTicket(req.dbconnection, id, title)

  res.status(200).json(ticket);
};

export const deleteTickets = async (req, res) => {
  const { id } = req.params

  if (!id) throw Error(ValidationError('Hiring Source ID as parameter is required'))

  const ticket = await deleteTicket(req.dbconnection, id)

  if (ticket.affectedRows <= 0) throw Error(NotFoundError('CV Hiring Source is not found'))

  res.status(200).json({ message: 'CV Hiring Source deleted successfully' });
};