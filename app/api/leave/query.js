import { whereQuery, insertIntoQuery, updateSetQuery } from "../../lib/utils.js";

export async function getLeave(dbconnection, filters) {
  let queryString = `
    SELECT 
      * 
    FROM 
      list_leave
  `;
  const { query, params } = whereQuery('list_leave', queryString, filters, 'AND', false)

  const [Leaves] = await dbconnection.query(query, params)

  return Leaves
}

export async function getLeaveForApprover(dbconnection, filters) {
  let queryString = `
    SELECT 
      list_leave.*, 
      CONCAT(uacc.ufname, ' ', uacc.ulname) as l_user
    FROM 
      list_leave
    INNER JOIN 
      uacc
    ON
      uacc.uid = list_leave.createdby
  `;
  const { query, params } = whereQuery('list_leave', queryString, filters, 'AND', false)

  const [Leaves] = await dbconnection.query(query, params)

  return Leaves
}

export async function getLeaveDashboard(dbconnection, fields = '*', filters) {
  let queryString = `
    SELECT 
      ${fields}
    FROM 
      list_leave
  `;

  const { query, params } = whereQuery('list_leave', queryString, filters, 'AND', false)

  const [leaves] = await dbconnection.query(query, params)

  return leaves
}

export async function getLeaveById(dbconnection, id) {
  const [Leave] = await dbconnection.query("SELECT * FROM `list_leave` WHERE l_id = ?", [id])

  return Leave
}

export async function createLeave(dbconnection, options) {
  const { query, params } = insertIntoQuery(`list_leave`, options)

  const [result] = await dbconnection.query(query, params)

  const [Leave] = await getLeaveById(dbconnection, result.insertId);

  return Leave
}

export async function updateLeave(dbconnection, options, whereOptions) {
  const { query, params } = updateSetQuery(`list_leave`, options, whereOptions)

  await dbconnection.query(query, params)

  const [Leave] = whereOptions?.l_id ? await getLeaveById(dbconnection, whereOptions?.l_id) : [null];

  return Leave
}

export async function updateApproveAll(dbconnection, options) {
  const { query, params } = updateSetQuery(`list_leave`, options, { l_status: '=Pending' })

  const [Leave] = await dbconnection.query(query, params)

  return Leave
}

export async function updateApprove(dbconnection, options, whereOptions) {
  const { query, params } = updateSetQuery(`list_leave`, options, whereOptions)

  const [locationLog] = await dbconnection.query(query, params)

  return locationLog
}

export async function deleteLeave(dbconnection, id) {
  const [Leave] = await dbconnection.query("DELETE FROM `list_leave` WHERE l_id = ?", [id])

  return Leave
}

