export async function getMenus(dbconnection) {
  const [menus] = await dbconnection.query("SELECT * FROM `menus`")

  return menus
}

export async function getMenusById(dbconnection, id) {
  const [menus] = await dbconnection.query("SELECT * FROM `menus` WHERE id = ?", [id])

  return menus
}

export async function getMenusByRoleAndUserId(dbconnection, role, userId) {
  const [menus] = await dbconnection.query("SELECT  `menus`.`id`, `menus`.`parentId`, `menus`.`name`, `menus`.`component`, `menus`.`path`, `menus`.`icon` FROM menus LEFT JOIN `menu_per_user` ON `menus`.`id` = `menu_per_user`.`menuId` AND `menu_per_user`.`userId` = ? INNER JOIN `menu_per_role` ON `menus`.`id` = `menu_per_role`.`menuId` AND `menu_per_role`.`role` = ? WHERE (`menu_per_user`.`isIncluded` = 'YES' OR `menu_per_user`.`isIncluded` IS NULL) ORDER BY `menu_per_user`.`id` DESC", [userId, role])

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