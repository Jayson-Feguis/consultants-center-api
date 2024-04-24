import { addSearchQuery } from "../../lib/utils.js"

export async function getAnnouncementsForAll(dbconnection, filters) {
  let queryString = `
  SELECT 
        announcements.* 
  FROM 
        announcements 
  LEFT JOIN 
        medias ON medias.id = announcements.image`

  const { query, params } = addSearchQuery('announcements', queryString, filters)

  const [announcements] = await dbconnection.query(query, params)

  return announcements
}
export async function getActiveAnnouncementsForAll(dbconnection) {
  const [announcements] = await dbconnection.query(`
    SELECT 
          announcements.* 
    FROM 
          announcements 
    LEFT JOIN 
          medias ON medias.id = announcements.image  WHERE announcements.isActive = 'YES'`)

  return announcements
}

export async function getAnnouncementsById(dbconnection, id) {
  const [announcements] = await dbconnection.query("SELECT * FROM `announcements` WHERE id = ?", [id])

  return announcements
}

export async function createAnnouncement(dbconnection, title, description, image, isActive) {
  const [result] = await dbconnection.query("INSERT INTO `announcements` (`title`, `description`, `image`, `isActive`) VALUES (?,?,?,?)", [title, description, image, isActive])

  const [announcement] = await getAnnouncementsById(dbconnection, result.insertId);

  return announcement
}

export async function updateAnnouncement(dbconnection, id, title, description, image, isActive) {
  if (image) await dbconnection.query("UPDATE `announcements` SET `title` = ?, `description` = ?, `image` = ?, `isActive` = ? WHERE id = ?", [title, description, image, isActive, id])
  else await dbconnection.query("UPDATE `announcements` SET `title` = ?, `description` = ?, `isActive` = ? WHERE id = ?", [title, description, isActive, id])

  const [announcement] = await getAnnouncementsById(dbconnection, id);

  return announcement
}

export async function deleteAnnouncement(dbconnection, id) {
  const [announcement] = await dbconnection.query("DELETE FROM `announcements` WHERE id = ?", [id])

  return announcement
}