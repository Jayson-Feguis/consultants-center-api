import { insertIntoQuery } from "../../lib/utils.js"

export async function getMediaById(dbconnection, id) {
  const [media] = await dbconnection.query("SELECT * FROM `medias` WHERE id = ?", [id])

  return media
}

export async function createMedia(dbconnection, options) {
  const { query, params } = insertIntoQuery(`medias`, options)

  const [media] = await dbconnection.query(query, params)

  return media
}
