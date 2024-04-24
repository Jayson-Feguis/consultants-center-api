export async function getMediaById(dbconnection, id) {
  const [media] = await dbconnection.query("SELECT * FROM `medias` WHERE id = ?", [id])

  return media
}

export async function createMedia(dbconnection, filePath) {
  const [media] = await dbconnection.query("INSERT INTO `medias`(`filePath`) VALUES (?)", [filePath])

  return media
}
