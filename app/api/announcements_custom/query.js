export async function getAnnouncementsCustom(dbconnection) {
  const [announcementsCustom] = await dbconnection.query("SELECT * FROM `announcements_custom`")

  return announcementsCustom
}

export async function getAnnouncementsCustomByAnnouncementId(dbconnection, announcementId) {
  const [announcementsCustom] = await dbconnection.query('SELECT DISTINCT(uacc.uid) as id, CONCAT(uacc.ufname, " ", uacc.ulname) as name FROM `announcements_custom` INNER JOIN uacc ON uacc.uid = announcements_custom.userId WHERE `announcements_custom`.`announcementId` = ?', [announcementId])

  return announcementsCustom
}

export async function getAnnouncementsCustomById(dbconnection, id) {
  const [announcementsCustom] = await dbconnection.query("SELECT * FROM `announcements_custom` WHERE id = ?", [id])

  return announcementsCustom
}

export async function createAnnouncementCustom(dbconnection, id, userId) {
  const [result] = await dbconnection.query("INSERT INTO `announcements_custom`(`announcementId`, `userId`) VALUES (?,?)", [id, userId])

  const [announcementsCustom] = await getAnnouncementsCustomById(dbconnection, result.insertId);

  return announcementsCustom
}

export async function deleteAnnouncementCustomByAnnouncementId(dbconnection, announcementId) {
  const [announcementsCustom] = await dbconnection.query("DELETE FROM `announcements_custom` WHERE announcementId = ?", [announcementId])

  return announcementsCustom
}