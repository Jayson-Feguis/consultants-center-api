import { WORK_LOCATION } from "../../lib/constants.js"

export async function getLocationLogs(dbconnection) {
  const [locationLogs] = await dbconnection.query("SELECT * FROM `log_location`")

  return locationLogs
}

export async function getLocationLogsByMonth(dbconnection, year, month) {
  const [locationLogs] = await dbconnection.query(`
  SELECT * FROM log_location
  WHERE 
      YEAR(checkedin) = ? AND MONTH(checkedin) = ?`, [year, month])

  return locationLogs
}

export async function getOneCurrentLocationLogByUserId(dbconnection, userId) {
  const [locationLogs] = await dbconnection.query(`
  SELECT * FROM log_location
  WHERE 
      uid = ? AND (checkedout is NULL OR DATE(checkedin) = CURDATE())
      ORDER BY checkedin DESC
      LIMIT 1`, [userId])

  return locationLogs
}

export async function getLocationLogById(dbconnection, id) {
  const [locationLogs] = await dbconnection.query("SELECT * FROM `log_location` WHERE id = ?", [id])

  return locationLogs
}

export async function createLocationLog(dbconnection, checkedInLocation, checkedInCoordinates, userId) {
  const [result] = await dbconnection.query(`
  INSERT INTO log_location
      (checkedinlocation, checkedin, checkedincoordinates, datelogged, location, createdby, uid, logdate) 
  VALUES 
      (?,?,?,?,?,?,?,?)`, [checkedInLocation, new Date(), checkedInCoordinates, new Date(), WORK_LOCATION.HOME, userId, userId, new Date()])

  const [locationLog] = await getLocationLogById(dbconnection, result.insertId);

  return locationLog
}

export async function updateLocationLog(dbconnection, id, checkedOutLocation, checkedOutDate, checkedOutCoordinates) {
  await dbconnection.query(`
  UPDATE log_location 
  SET 
      checkedoutlocation = ?, checkedout = ?, checkedoutcoordinates = ?
  WHERE 
      id = ?`, [checkedOutLocation, checkedOutDate, checkedOutCoordinates, id])

  const [locationLog] = await getLocationLogById(dbconnection, id);

  return locationLog
}