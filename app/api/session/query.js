import mysql from '../../config/db.config.js'


export async function getSessionByUserId(id) {
  const [session] = await mysql.query("SELECT * from `sessions` where userId=?", [id])

  return session
}


export async function getSessionByToken(token) {
  const [session] = await mysql.query("SELECT * from `sessions` where token=?", [token])

  return session
}

export async function deleteAllSessionWhereTokenExpired() {
  const [session] = await mysql.query("DELETE FROM `sessions` WHERE tokenExpiration < NOW()")

  return session
}

export async function deleteSessionByUserId(userId) {
  const [session] = await mysql.query("DELETE FROM `sessions` WHERE userId = ?", [userId])

  return session
}


export async function createSession(userId, userAgent, ipAddress, token, expiration) {
  const session = await getSessionByUserId(userId)

  if (session.length <= 0) await mysql.query("INSERT INTO `sessions`(`userId`, `userAgent`, `ipAddress`, `token`, `tokenExpiration`) VALUES (?, ?, ?, ?, ?)", [userId, userAgent, ipAddress, token, new Date(expiration * 1000)])
  else await mysql.query("UPDATE `sessions` SET `userAgent` = ?, `ipAddress` = ?, `token` = ?, `tokenExpiration` = ? WHERE userId = ?", [userAgent, ipAddress, token, new Date(expiration * 1000), userId])
}