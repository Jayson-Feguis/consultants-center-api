export async function getAnnouncementsPerDb(dbconnection) {
  const [announcements] = await dbconnection.query(`
    SELECT 
          announcements_per_db.* 
    FROM 
          announcements_per_db 
    LEFT JOIN 
          medias ON medias.id = announcements_per_db.image`)

  return announcements
}

export async function getAnnouncementsPerDbById(dbconnection, id) {
  const [announcements] = await dbconnection.query("SELECT * FROM `announcements_per_db` WHERE id = ?", [id])

  return announcements
}

export async function getAnnouncementsPerDbByUserId(dbconnection, userId) {
  const [announcements] = await dbconnection.query(`(
    SELECT 
        apd.id,
        apd.title,
        apd.description,
        apd.image,
        apd.isActive,
        apd.receiver,
        apd.createdAt,
        apd.updatedAt
    FROM 
        announcements_per_db apd
    LEFT JOIN 
        announcements_custom ac ON apd.id = ac.announcementId
    WHERE 
        apd.receiver = 'CUSTOM' AND apd.isActive = 'YES' AND ac.userId = ?
)
UNION
(
    SELECT 
        apd.id,
        apd.title,
        apd.description,
        apd.image,
        apd.isActive,
        apd.receiver,
        apd.createdAt,
        apd.updatedAt
    FROM 
        announcements_per_db apd
    WHERE 
        apd.receiver = 'ALL' AND apd.isActive = 'YES'
) ORDER BY updatedAt DESC`, [userId])

  return announcements
}

export async function createAnnouncementPerDb(dbconnection, title, description, image, receiver) {
  const [result] = await dbconnection.query("INSERT INTO `announcements_per_db`(`title`, `description`, `image`, `receiver`) VALUES (?,?,?,?)", [title, description, image, receiver])

  const [announcement] = await getAnnouncementsPerDbById(dbconnection, result.insertId);

  return announcement
}

export async function updateAnnouncementPerDb(dbconnection, id, title, description, image, isActive, receiver) {
  if (image) await dbconnection.query("UPDATE `announcements_per_db` SET `title` = ?, `description` = ?, `image` = ?, `isActive` = ?, `receiver` = ? WHERE id = ?", [title, description, image, isActive, receiver, id])
  else await dbconnection.query("UPDATE `announcements_per_db` SET `title` = ?, `description` = ?, `isActive` = ?, `receiver` = ? WHERE id = ?", [title, description, isActive, receiver, id])

  const [announcement] = await getAnnouncementsPerDbById(dbconnection, id);

  return announcement
}

export async function deleteAnnouncementPerDb(dbconnection, id) {
  const [announcement] = await dbconnection.query("DELETE FROM `announcements_per_db` WHERE id = ?", [id])

  return announcement
}