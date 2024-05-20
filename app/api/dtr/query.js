import { insertIntoQuery } from "../../lib/utils.js"

export async function getDTR(dbconnection) {
  const [dtr] = await dbconnection.query("SELECT * FROM `dtr`")

  return dtr
}

export async function getDTRById(dbconnection, id) {
  const [dtr] = await dbconnection.query("SELECT * FROM `dtr` WHERE id = ?", [id])

  return dtr
}

export async function createDTR(dbconnection, options) {
  const { query, params } = insertIntoQuery(`dtr`, options)

  const [result] = await dbconnection.query(query, params)

  const [menu] = await getDTRById(dbconnection, result.insertId);

  return menu
}