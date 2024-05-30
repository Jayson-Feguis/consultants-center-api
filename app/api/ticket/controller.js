import _ from "lodash";
import { NotFoundError, transformResponse, ValidationError } from "../../lib/utils.js";
import { getUserById } from "../user/query.js";
import { getTicket, createTicket, updateTicket, deleteTicket } from "./query.js";
import { validateCreateTicket, validateUpdateTicket } from "./validation.js";
import { getMediaById } from "../media/query.js";

export const getTickets = async (req, res) => {
  let tickets = await getTicket(req.dbconnection, req.query)

  tickets = await Promise.all(tickets.map(async t => {
    let [createdby] = await getUserById(req.dbconnection, t.t_createdby)
    let [updatedby] = await getUserById(req.dbconnection, t.t_updatedby)
    createdby = createdby ? _.omit(createdby, ['upswd', 'udb']) : null
    updatedby = updatedby ? _.omit(updatedby, ['upswd', 'udb']) : null

    if (_.has(createdby, 'uprofilepic')) {
      const [profile] = await getMediaById(req.dbconnection, createdby.uprofilepic)
      createdby.uprofilepic = profile
    }

    if (_.has(updatedby, 'uprofilepic')) {
      const [profile] = await getMediaById(req.dbconnection, updatedby.uprofilepic)
      updatedby.uprofilepic = profile
    }

    t.t_createdby = createdby
    t.t_updatedby = updatedby
    return t
  }))

  res.status(200).json(transformResponse(tickets));
};

export const createTickets = async (req, res) => {
  await validateCreateTicket(req.body)

  const ticket = await createTicket(req.dbconnection, { ...req.body, t_datecreated: Math.floor(Number(new Date()) / 1000), t_dateupdated: Math.floor(Number(new Date()) / 1000), t_createdby: req.user?.id })

  res.status(201).json(ticket);
};

export const updateTickets = async (req, res) => {
  await validateUpdateTicket({ ...req.params, ...req.body })

  const ticket = await updateTicket(req.dbconnection, { ...req.body, t_dateupdated: Math.floor(Number(new Date()) / 1000), t_updatedby: req.user?.id }, req.params)

  res.status(200).json(ticket);
};

export const deleteTickets = async (req, res) => {
  const { id } = req.params

  if (!id) throw Error(ValidationError('Ticket ID as parameter is required'))

  const ticket = await deleteTicket(req.dbconnection, id)

  if (ticket.affectedRows <= 0) throw Error(NotFoundError('Ticket is not found'))

  res.status(200).json({ message: 'Ticket deleted successfully' });
};