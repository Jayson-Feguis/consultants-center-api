export async function getDTR(dbconnection) {
  const [dtr] = await dbconnection.query("SELECT * FROM `dtr`")

  return dtr
}

export async function getDTRById(dbconnection, id) {
  const [dtr] = await dbconnection.query("SELECT * FROM `dtr` WHERE id = ?", [id])

  return dtr
}

export async function createDTR(dbconnection, checkInLocation) {
  const [result] = await dbconnection.query("INSERT INTO `dtr`( `checkInLocation`) VALUES (?)", [checkInLocation])

  const [menu] = await getDTRById(dbconnection, result.insertId);

  return menu
}