import mysql from '../../config/db.config.js'


export async function getMediaById(id) {
  const [media] = await mysql.query("SELECT * FROM `medias` WHERE id = ?", [id])

  return media
}

export async function createMedia(filePath) {
  const [media] = await mysql.query("INSERT INTO `medias`(`filePath`) VALUES (?)", [filePath])

  return media
}
