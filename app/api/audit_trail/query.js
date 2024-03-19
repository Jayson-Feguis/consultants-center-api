import mysql from '../../config/db.config.js'


export async function createAuditTrail(req, module, tableName, recordId, action, oldValue, newValue) {
  const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const userAgent = req.headers["user-agent"];

  const [auditTrail] = await mysql.query("INSERT INTO `audit_trail`(`userId`, `module`, `tableName`, `recordId`, `action`, `oldValue`, `newValue`, `ipAddress`, `userAgent`) VALUES (?,?,?,?,?,?,?,?,?)", [req.user.id, module, tableName, recordId, action, oldValue, newValue, ipAddress, userAgent])

  return auditTrail
}