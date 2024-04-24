export async function getUsersForAnnouncement(dbconnection) {
  const [users] = await dbconnection.query("SELECT uacc.uid as id, CONCAT(uacc.ufname, ' ', uacc.ulname) as name FROM `uacc`")

  return users
}

export async function getUserById(dbconnection, id) {
  const [user] = await dbconnection.query("SELECT * FROM `uacc` WHERE uid=?", [id])

  return user
}

export async function getUserByEmail(dbconnection, email) {
  const [user] = await dbconnection.query("SELECT * FROM `uacc` WHERE uemail=?", [email])

  return user
}

export async function getUserAndRoleByEmail(dbconnection, email) {
  const [user] = await dbconnection.query("SELECT * FROM uacc WHERE uemail=?", [email])

  return user
}


export async function createUser(dbconnection, roleId, firstName, lastName, email, password) {
  const [result] = await dbconnection.query("INSERT INTO `uacc`(`roleId`,`firstName`, `lastName`, `email`, `password`) VALUES (?, ?, ?, ?, ?)", [roleId, firstName, lastName, email, password])

  const [user] = await getUserById(dbconnection, result.insertId)

  return user
}

export async function updateUserPasswordById(dbconnection, userId, password) {
  await dbconnection.query("UPDATE `uacc` SET `upswd` = ? WHERE uid = ?", [password, userId])

  const user = await getUserById(dbconnection, userId)

  return user
}

export async function updateUserProfileById(dbconnection, userId, profilePicture, firstName, lastName) {
  if (profilePicture) await dbconnection.query("UPDATE `uacc` SET uprofilepic = ?, ufname = ?, ulname = ? WHERE uid = ?", [profilePicture, firstName, lastName, userId])
  else await dbconnection.query("UPDATE `uacc` SET ufname = ?, ulname = ? WHERE uid = ?", [firstName, lastName, userId])

  const user = await getUserById(dbconnection, userId)

  return user
}