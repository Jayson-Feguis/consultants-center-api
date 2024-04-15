import { NotFoundError, transformResponse, ValidationError } from "../../lib/utils.js";
import { deleteMenusPerRoleByMenuID } from "../menu_per_role/query.js";
import { deleteMenusPerUserByMenuID } from "../menu_per_user/query.js";
import { getMenus, createMenu, updateMenu, deleteMenu, getMenusByRoleAndUserId } from "./query.js";
import { validateCreateMenu } from "./validation.js";

export const getMenusPerUser = async (req, res) => {
  const menus = await getMenusByRoleAndUserId(req.dbconnection, req.user.role, req.user.id)

  res.status(200).json(transformResponse(menus));
};

export const getAllMenus = async (req, res) => {
  const menus = await getMenus(req.dbconnection)

  res.status(200).json(transformResponse(menus));
};

export const createMenus = async (req, res) => {
  await validateCreateMenu(req.body)
  const { parentId, name, icon, component, path } = req.body

  const menu = await createMenu(req.dbconnection, parentId, name, icon, component, path)

  res.status(201).json(menu);
};

export const updateMenus = async (req, res) => {
  await validateCreateMenu(req.body)
  const { parentId, name, icon, component, path } = req.body
  const { id } = req.params

  if (!id) throw Error(ValidationError('Menu ID as parameter is required'))

  const menu = await updateMenu(req.dbconnection, id, parentId, name, icon, component, path)

  res.status(200).json(menu);
};

export const deleteMenus = async (req, res) => {
  const { id } = req.params

  if (!id) throw Error(ValidationError('Menu ID as parameter is required'))

  const menu = await deleteMenu(req.dbconnection, id)

  if (menu.affectedRows <= 0) throw Error(NotFoundError('Menu is not found'))

  await Promise.all([deleteMenusPerRoleByMenuID(req.dbconnection, id), deleteMenusPerUserByMenuID(req.dbconnection, id)])

  res.status(200).json({ message: 'Menu deleted successfully' });
};
