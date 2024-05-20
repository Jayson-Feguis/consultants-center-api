import { whereQuery, insertIntoQuery, updateSetQuery } from "../../lib/utils.js";

export async function getTicket(dbconnection, filters) {
  let queryString = `
    SELECT 
      * 
    FROM 
      ticket
  `;
  const { query, params } = whereQuery('ticket', queryString, filters)

  const [tickets] = await dbconnection.query(query, params)

  return tickets
}

export async function getTicketById(dbconnection, id) {
  const [ticket] = await dbconnection.query("SELECT * FROM `ticket` WHERE t_id = ?", [id])

  return ticket
}

export async function createTicket(dbconnection, options) {
  const { query, params } = insertIntoQuery(`ticket`, options)

  const [result] = await dbconnection.query(query, params)

  const [tickets] = await getTicketById(dbconnection, result.insertId);

  return tickets
}

export async function updateTicket(dbconnection, options, whereOptions) {
  const { query, params } = updateSetQuery(`ticket`, options, whereOptions)

  await dbconnection.query(query, params)

  const [ticket] = whereOptions?.t_id ? await getTicketById(dbconnection, whereOptions?.t_id) : [null];

  return ticket
}

export async function deleteTicket(dbconnection, id) {
  const [ticket] = await dbconnection.query("DELETE FROM `ticket` WHERE t_id = ?", [id])

  return ticket
}