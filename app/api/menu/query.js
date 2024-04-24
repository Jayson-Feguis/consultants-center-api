import { addSearchQuery } from "../../lib/utils.js";

export async function getMenus(dbconnection, filters) {
  let queryString = `SELECT * FROM menus`;

  const { query, params } = addSearchQuery('menus', queryString, filters)

  const [menus] = await dbconnection.query(query, params)

  return menus
}

export async function getMenusById(dbconnection, id) {
  const [menus] = await dbconnection.query("SELECT * FROM `menus` WHERE id = ?", [id])

  return menus
}

export async function getMenusByRoleAndUserId(dbconnection, role, userId) {
  const [menus] = await dbconnection.query(`
  (
      SELECT 
          m.id, 
          m.parentId, 
          m.name, 
          m.component, 
          m.path, 
          m.icon 
      FROM 
          menus m
      INNER JOIN 
          menu_per_role mpr
          ON m.id = mpr.menuId 
          AND mpr.role = ?
      LEFT JOIN
          menu_per_user mpu
          ON m.id = mpu.menuId 
          AND mpu.userId = ?
      WHERE 
          (mpu.isIncluded = 'YES' OR mpu.isIncluded IS NULL)
  )
  UNION 
  (
      SELECT 
          m.id, 
          m.parentId, 
          m.name, 
          m.component, 
          m.path, 
          m.icon 
      FROM 
          menus m
      INNER JOIN 
          menu_per_user mpu
          ON m.id = mpu.menuId 
          AND mpu.userId = ?
      WHERE 
          (mpu.isIncluded = 'YES' OR mpu.isIncluded IS NULL)
  )`, [role, userId, userId])

  return menus
}

export async function createMenu(dbconnection, parentId, name, icon, component, path) {
  let query, params;

  if (parentId) {
    query = "INSERT INTO `menus`( `parentId`, `name`, `icon`, `component`, `path`) VALUES (?,?,?,?,?)"
    params = [parentId, name, icon, component, path]
  } else {
    query = "INSERT INTO `menus`(`name`, `icon`, `component`, `path`) VALUES (?,?,?,?)"
    params = [name, icon, component, path]
  }

  const [result] = await dbconnection.query(query, params)

  const [menu] = await getMenusById(dbconnection, result.insertId);

  return menu
}

export async function updateMenu(dbconnection, id, parentId, name, icon, component, path) {
  let query, params;

  if (parentId) {
    query = "UPDATE `menus` SET `parentId` = ?, `name` = ?, `icon` = ?, `component` = ?, `path` = ? WHERE id = ?"
    params = [parentId, name, icon, component, path, id]
  } else {
    query = "UPDATE `menus` SET `name` = ?, `icon` = ?, `component` = ?, `path` = ? WHERE id = ?"
    params = [name, icon, component, path, id]
  }

  await dbconnection.query(query, params)

  const [menu] = await getMenusById(dbconnection, id);

  return menu
}

export async function deleteMenu(dbconnection, id) {
  const [menu] = await dbconnection.query("DELETE FROM `menus` WHERE id = ?", [id])

  return menu
}