import { whereQuery, insertIntoQuery, updateSetQuery, generateCutOff } from "../../lib/utils.js";

export async function getOvertime(dbconnection, filters) {
  let queryString = `
    SELECT 
      * 
    FROM 
      list_overtime
  `;
  const { query, params } = whereQuery('list_overtime', queryString, filters)

  const [overtimes] = await dbconnection.query(query, params)

  return overtimes
}

export async function getOvertimeForApprover(dbconnection, filters) {
  let queryString = `
    SELECT 
      list_overtime.*, 
      CONCAT(uacc.ufname, ' ', uacc.ulname) as lot_user
    FROM 
      list_overtime
    INNER JOIN 
      uacc
    ON
      uacc.uid = list_overtime.lot_createdby
  `;
  const { query, params } = whereQuery('list_overtime', queryString, filters)

  const [overtimes] = await dbconnection.query(query, params)

  return overtimes
}

export async function getOvertimeDashboard(dbconnection, fields = '*', filters) {
  let queryString = `
    SELECT 
      ${fields}
    FROM 
      list_overtime
  `;
  const { query, params } = whereQuery('list_overtime', queryString, filters)

  const [overtimes] = await dbconnection.query(query, params)

  return overtimes
}

export async function getOvertimeById(dbconnection, id) {
  const [overtime] = await dbconnection.query("SELECT * FROM `list_overtime` WHERE lot_id = ?", [id])

  return overtime
}

export async function createOvertime(dbconnection, options) {
  const { query, params } = insertIntoQuery(`list_overtime`, options)

  const [result] = await dbconnection.query(query, params)

  const [overtime] = await getOvertimeById(dbconnection, result.insertId);

  return overtime
}

export async function updateOvertime(dbconnection, options, whereOptions) {
  const { query, params } = updateSetQuery(`list_overtime`, options, whereOptions)

  await dbconnection.query(query, params)

  const [overtime] = whereOptions?.lot_id ? await getOvertimeById(dbconnection, whereOptions?.lot_id) : [null];

  return overtime
}

export async function updateApproveAll(dbconnection, options) {
  const cutoff = generateCutOff(new Date(), 1)[0]

  const { query, params } = updateSetQuery(`list_overtime`, options, { lot_ot_status: '=Pending', lot_date: `${cutoff.fromDate},${cutoff.toDate}` })

  const [overtime] = await dbconnection.query(query, params)

  return overtime
}

export async function updateApprove(dbconnection, options, whereOptions) {
  const { query, params } = updateSetQuery(`list_overtime`, options, whereOptions)

  const [locationLog] = await dbconnection.query(query, params)

  return locationLog
}

export async function deleteOvertime(dbconnection, id) {
  const [overtime] = await dbconnection.query("DELETE FROM `list_overtime` WHERE lot_id = ?", [id])

  return overtime
}

