export async function getUsersFromMenusPerUser(dbconnection) {
  const [menusPerUser] = await dbconnection.query(`
  SELECT 
      DISTINCT(menu_per_user.userId) as userId 
  FROM 
      menu_per_user
  `)

  return menusPerUser.map(user => user.userId)
}

export async function getMenusPerUserById(dbconnection, id) {
  const [menusPerUser] = await dbconnection.query("SELECT * FROM `menu_per_user` WHERE id = ?", [id])

  return menusPerUser
}

export async function getMenusPerUserByUser(dbconnection, userId, isIncluded) {
  const [menusPerUser] = await dbconnection.query(`
  SELECT 
      m.* 
  FROM 
      menu_per_user mpu
  INNER JOIN menus m ON m.id = mpu.menuId 
  WHERE 
      mpu.userId = ? AND mpu.isIncluded = ?`, [userId, isIncluded])

  return menusPerUser
}

export async function getMenusPerUserByUserId(dbconnection, userId) {
  const [menusPerUser] = await dbconnection.query(`
  SELECT 
      m.* 
  FROM 
      menu_per_user mpu
  INNER JOIN menus m ON m.id = mpu.menuId 
  WHERE 
      mpu.userId = ?`, [userId])

  return menusPerUser
}

export async function createMenuPerUser(dbconnection, userId, menuId, isIncluded) {
  const [result] = await dbconnection.query("INSERT INTO `menu_per_user`( `userId`, `menuId`, `isIncluded`) VALUES (?,?,?)", [userId, menuId, isIncluded])

  const [menuPerUser] = await getMenusPerUserById(dbconnection, result.insertId);

  return menuPerUser
}

export async function updateMenuPerUser(dbconnection, id, isIncluded) {
  await dbconnection.query("UPDATE `menu_per_user` SET `isIncluded` = ? WHERE id = ?", [isIncluded, id])

  const [menuPerUser] = await getMenusPerUserById(dbconnection, id);

  return menuPerUser
}

export async function deleteMenuPerUserById(dbconnection, id) {
  const [menuPerUser] = await dbconnection.query("DELETE FROM `menu_per_user` WHERE id = ?", [id])

  return menuPerUser
}

export async function deleteMenusPerUserByMenuID(dbconnection, menuId) {
  const [menuPerUser] = await dbconnection.query("DELETE FROM `menu_per_user` WHERE menuId = ?", [menuId])

  return menuPerUser;
}

export async function deleteMenusPerUserByUserId(dbconnection, userId) {
  const [menusPerUser] = await dbconnection.query("DELETE FROM `menu_per_user` WHERE userId = ?", [userId])

  return menusPerUser;
}
