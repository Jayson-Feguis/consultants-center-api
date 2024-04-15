export async function deleteMenusPerUserByMenuID(dbconnection, menuId) {
  const [menus] = await dbconnection.query("DELETE FROM `menu_per_user` WHERE menuId = ?", [menuId])

  return menus;
}
