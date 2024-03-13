import mysql from '../../config/db.config.js'


export async function getUserById(id) {

  const [user] = await mysql.query("SELECT * from `users` where id=?", [id])

  return user

}

export async function getUserAndRoleByEmail(email) {

  const [user] = await mysql.query("SELECT * from `users` INNER JOIN `roles` ON users.roleId = roles.id where email=?", [email])

  return user[0]

}


export async function createUser(roleId, firstName, lastName, email, password) {

  const [userId] = await mysql.query("INSERT INTO `users`(`roleId`,`firstName`, `lastName`, `email`, `password`) VALUES (?, ?, ?, ?)", [roleId, firstName, lastName, email, password])

  const [user] = await getUserById(userId.insertId)

  return user

}