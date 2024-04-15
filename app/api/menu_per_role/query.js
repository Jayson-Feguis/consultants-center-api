export async function getRolesFromMenusPerRole(dbconnection) {
  const [menusPerRole] = await dbconnection.query(`
  SELECT 
      DISTINCT(menu_per_role.role) as role 
  FROM 
      menu_per_role
  `)

  return menusPerRole.map(role => role.role)
}

export async function getMenusPerRoleById(dbconnection, id) {
  const [menusPerRole] = await dbconnection.query("SELECT * FROM `menu_per_role` WHERE id = ?", [id])

  return menusPerRole
}

export async function getMenusPerRoleByRole(dbconnection, role) {
  const [menusPerRole] = await dbconnection.query(`
  SELECT 
      m.* 
  FROM 
      menu_per_role mpr
  INNER JOIN menus m ON m.id = mpr.menuId 
  WHERE 
      mpr.role = ?`, [role])

  return menusPerRole
}

export async function createMenuPerRole(dbconnection, role, menuId) {
  const [result] = await dbconnection.query("INSERT INTO `menu_per_role`( `role`, `menuId`) VALUES (?,?)", [role, menuId])

  const [menuPerRole] = await getMenusPerRoleById(dbconnection, result.insertId);

  return menuPerRole
}

export async function updateMenuPerRole(dbconnection, id, role, menuId) {
  let query, params;

  if (role && menuId) {
    query = "UPDATE `menu_per_role` SET `role` = ?, `menuId` = ? WHERE id = ?"
    params = [role, menuId, id]
  } else if (role && !menuId) {
    query = "UPDATE `menu_per_role` SET `role` = ? WHERE id = ?"
    params = [role, id]
  } else if (!role && menuId) {
    query = "UPDATE `menu_per_role` SET `menuId` = ? WHERE id = ?"
    params = [menuId, id]
  }

  await dbconnection.query(query, params)

  const [menuPerRole] = await getMenusPerRoleById(dbconnection, id);

  return menuPerRole
}

export async function deleteMenuPerRoleById(dbconnection, id) {
  const [menuPerRole] = await dbconnection.query("DELETE FROM `menu_per_role` WHERE id = ?", [id])

  return menuPerRole
}

export async function deleteMenusPerRoleByMenuID(dbconnection, menuId) {
  const [menusPerRole] = await dbconnection.query("DELETE FROM `menu_per_role` WHERE menuId = ?", [menuId])

  return menusPerRole;
}

export async function deleteMenusPerRoleByRole(dbconnection, role) {
  const [menusPerRole] = await dbconnection.query("DELETE FROM `menu_per_role` WHERE role = ?", [role])

  return menusPerRole;
}