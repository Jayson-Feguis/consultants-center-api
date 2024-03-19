import mysql from '../../config/db.config.js'


export async function getUserById(id) {
  const [user] = await mysql.query("SELECT * from `users` where id=?", [id])

  return user
}

export async function getUserByEmail(email) {
  const [user] = await mysql.query("SELECT * from `users` where email=?", [email])

  return user
}

export async function getUserAndRoleByEmail(email) {
  const [user] = await mysql.query("SELECT users.*, roles.role from `users` INNER JOIN `roles` ON users.roleId = roles.id where email=?", [email])

  return user
}


export async function createUser(roleId, firstName, lastName, email, password) {
  const [result] = await mysql.query("INSERT INTO `users`(`roleId`,`firstName`, `lastName`, `email`, `password`) VALUES (?, ?, ?, ?, ?)", [roleId, firstName, lastName, email, password])

  const [user] = await getUserById(result.insertId)

  return user
}

export async function updateUserPasswordById(userId, password) {
  await mysql.query("UPDATE `users` SET `password` = ? WHERE id = ?", [password, userId])

  const user = await getUserById(userId)

  return user
}

export async function updateUserProfileById(userId, profilePicture, firstName, lastName) {
  if (profilePicture) await mysql.query("UPDATE `users` SET profilePicture = ?, firstName = ?, lastName = ? WHERE id = ?", [profilePicture, firstName, lastName, userId])
  else await mysql.query("UPDATE `users` SET firstName = ?, lastName = ? WHERE id = ?", [firstName, lastName, userId])

  const user = await getUserById(userId)

  return user
}