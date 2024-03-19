import mysql from '../../config/db.config.js'


export async function getMenusByRoleId(roleId) {
  const [menus] = await mysql.query("SELECT `menus`.`id`, `menus`.`name`, `menus`.`icon`, `menus`.`component`, `menus`.`path` FROM `menu_per_role` INNER JOIN `roles` ON `menu_per_role`.`roleId` = `roles`.`id` INNER JOIN `menus` ON `menu_per_role`.`menuId` = `menus`.`id` WHERE `roles`.`id` = ? AND  `menus`.`parentId` = 0", [roleId])

  const menusWithSubMenus = await Promise.all(menus.map(async menu => {
    menu.subMenus = await fetchSubMenusByRoleId(roleId, menu);

    if (menu.subMenus.length > 0) menu.hasSub = true;
    else menu.hasSub = false

    return menu;
  }));

  return menusWithSubMenus;
}

async function fetchSubMenusByRoleId(roleId, menu) {
  const [subMenus] = await mysql.query("SELECT `menus`.`id`, `menus`.`name`, `menus`.`icon`, `menus`.`component`, `menus`.`path` FROM `menu_per_role` INNER JOIN `roles` ON `menu_per_role`.`roleId` = `roles`.`id` INNER JOIN `menus` ON `menu_per_role`.`menuId` = `menus`.`id` WHERE `roles`.`id` = ? AND  `menus`.`parentId` = ?", [roleId, menu.id])

  if (subMenus.length > 0) {

    const subMenusWithChildren = await Promise.all(subMenus.map(async subMenu => {
      subMenu.subMenus = await fetchSubMenusByRoleId(roleId, subMenu);

      if (subMenu.subMenus.length > 0) subMenu.hasSub = true;
      else subMenu.hasSub = false

      return subMenu;
    }));

    return subMenusWithChildren;

  } else return []
}

export async function getMenusByUserId(userId) {
  const [menus] = await mysql.query("SELECT `menus`.`id`, `menus`.`name`, `menus`.`icon`, `menus`.`component`, `menus`.`path` FROM `menu_per_user` INNER JOIN `users` ON `menu_per_user`.`userId` = `users`.`id` INNER JOIN `menus` ON `menu_per_user`.`menuId` = `menus`.`id` WHERE `users`.`id` = ? AND  `menus`.`parentId` = 0", [userId])

  const menusWithSubMenus = await Promise.all(menus.map(async menu => {
    menu.subMenus = await fetchSubMenusByUserId(userId, menu);

    if (menu.subMenus.length > 0) menu.hasSub = true;
    else menu.hasSub = false

    return menu;
  }));

  return menusWithSubMenus;
}

async function fetchSubMenusByUserId(userId, menu) {
  const [subMenus] = await mysql.query("SELECT `menus`.`id`, `menus`.`name`, `menus`.`icon`, `menus`.`component`, `menus`.`path` FROM `menu_per_user` INNER JOIN `users` ON `menu_per_user`.`userId` = `users`.`id` INNER JOIN `menus` ON `menu_per_user`.`menuId` = `menus`.`id` WHERE `users`.`id` = ? AND  `menus`.`parentId` = ?", [userId, menu.id])

  if (subMenus.length > 0) {

    const subMenusWithChildren = await Promise.all(subMenus.map(async subMenu => {
      subMenu.subMenus = await fetchSubMenusByUserId(userId, subMenu);

      if (subMenu.subMenus.length > 0) subMenu.hasSub = true;
      else subMenu.hasSub = false

      return subMenu;
    }));

    return subMenusWithChildren;

  } else return []
}