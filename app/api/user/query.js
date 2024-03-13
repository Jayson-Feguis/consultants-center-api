import mysql from '../../config/db.config.js'


export async function getUserById(id) {

  const [user] = await mysql.query("SELECT * from `users` where id=?", [id])

  return user

}


export async function createUser(firstName, lastName, email, password) {

  const [userId] = await mysql.query("INSERT INTO `users`(`firstName`, `lastName`, `email`, `password`) VALUES (?, ?, ?, ?)", [firstName, lastName, email, password])

  const [user] = await getUserById(userId.insertId)

  return user

}