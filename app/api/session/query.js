import mysql from '../../config/db.config.js'


export async function getSessionByUserId(id) {

  const [session] = await mysql.query("SELECT * from `sessions` where userId=?", [id])

  return session

}

export async function createSession(userId, userAgent, ipAddress, token) {

  const session = await getSessionByUserId(userId)

  if (!session || session.length <= 0) await mysql.query("INSERT INTO `sessions`(`userId`, `userAgent`, `ipAddress`, `token`) VALUES (?, ?, ?, ?)", [userId, userAgent, ipAddress, token])

  else await mysql.query("UPDATE `sessions` SET `userAgent` = ?, `ipAddress` = ?, `token` = ?, `timestamp` = ? WHERE userId = ?", [userAgent, ipAddress, token, new Date(), userId])

}