import { WORK_LOCATION } from "../../lib/constants.js"
import { addSearchQuery } from "../../lib/utils.js"

export async function getLocationLogs(dbconnection) {
    const [locationLogs] = await dbconnection.query(`
  SELECT 
      * 
  FROM 
      log_location`)

    return locationLogs
}
export async function getLocationLogsAdjustments(dbconnection, filters) {
    let queryString = `
    SELECT 
        log_location.*,
        CONCAT(uacc.ufname, ' ', uacc.ulname) as user
    FROM 
        log_location
    INNER JOIN
        uacc
    ON
        log_location.createdby = uacc.uid`

    filters['isAdjusted'] = '>0';
    filters['status'] = 'Pending'


    const { query, params } = addSearchQuery('log_location', queryString, filters)
    console.log(filters, query, params)

    const [locationLogs] = await dbconnection.query(query, params)

    return locationLogs
}

export async function getLocationLogsByMonth(dbconnection, year, month) {
    const [locationLogs] = await dbconnection.query(`
  SELECT 
      * 
  FROM 
      log_location
  WHERE 
      YEAR(checkedin) = ? AND MONTH(checkedin) = ?`, [year, month])

    return locationLogs
}

export async function getOneCurrentLocationLogByUserId(dbconnection, userId) {
    const [locationLogs] = await dbconnection.query(`
  SELECT 
      * 
  FROM 
      log_location
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
  INSERT INTO 
      log_location (checkedinlocation, checkedin, checkedincoordinates, datelogged, location, createdby, uid, logdate) 
  VALUES 
      (?,?,?,?,?,?,?,?)`, [checkedInLocation, new Date(), checkedInCoordinates, new Date(), WORK_LOCATION.HOME, userId, userId, new Date()])

    const [locationLog] = await getLocationLogById(dbconnection, result.insertId);

    return locationLog
}

export async function updateLocationLog(dbconnection, id, checkedOutLocation, checkedOutDate, checkedOutCoordinates) {
    await dbconnection.query(`
  UPDATE 
      log_location 
  SET 
      checkedoutlocation = ?, checkedout = ?, checkedoutcoordinates = ?
  WHERE 
      id = ?`, [checkedOutLocation, checkedOutDate, checkedOutCoordinates, id])

    const [locationLog] = await getLocationLogById(dbconnection, id);

    return locationLog
}

export async function updateLocationLogAdjustment(dbconnection, id, checkedIn, checkedOut, remarks) {
    await dbconnection.query(`
  UPDATE 
      log_location 
  SET 
      checkedin = ?, checkedout = ?, isAdjusted = ?, remarks = ?, dateupdated = ?
  WHERE 
      id = ?`, [checkedIn, checkedOut, 1, remarks, new Date(), id])

    const [locationLog] = await getLocationLogById(dbconnection, id);

    return locationLog
}

export async function updateApproveAll(dbconnection, status) {
    const [locationLog] = await dbconnection.query(`
  UPDATE 
      log_location 
  SET 
      status = ?
  WHERE 
      isAdjusted > 0 AND status = 'Pending'`, [status])

    return locationLog
}

export async function updateApprove(dbconnection, id, status) {
    const [locationLog] = await dbconnection.query(`
  UPDATE 
      log_location 
  SET 
      status = ?
  WHERE 
      isAdjusted > 0 AND status = 'Pending' AND id = ?`, [status, id])

    return locationLog
}