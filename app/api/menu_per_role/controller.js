import { NotFoundError, transformResponse, ValidationError } from "../../lib/utils.js";
import { deleteMenusPerRoleByRole, getMenusPerRoleByRole } from "../menu_per_role/query.js";
import { getRolesFromMenusPerRole, createMenuPerRole } from "./query.js";
import { validateCreateMenuPerRole } from "./validation.js";

export const getAllMenusPerRole = async (req, res) => {
  const roles = await getRolesFromMenusPerRole(req.dbconnection)
  let menusPerRole = []

  if (roles && roles.length > 0) menusPerRole = await Promise.all(roles.map(async role => ({
    id: role,
    role,
    menus: await getMenusPerRoleByRole(req.dbconnection, role)
  })))

  res.status(200).json(transformResponse(menusPerRole));
};

export const createMenusPerRole = async (req, res) => {
  await validateCreateMenuPerRole(req.body)
  const { role, menus } = req.body

  const perRole = await getMenusPerRoleByRole(req.dbconnection, role)

  if (perRole.length > 0) throw Error(ValidationError(`${role} role is already created. Please check the table`))

  const menuPerRole = await Promise.all(menus.map(async menuId => await createMenuPerRole(req.dbconnection, { role, menuId })))

  res.status(201).json(menuPerRole);
};

export const updateMenusPerRole = async (req, res) => {
  await validateCreateMenuPerRole({ ...req.body, ...req.params })
  const { menus } = req.body
  const { role } = req.params

  if (!role) throw Error(ValidationError('Role as parameter is required'))

  const perRole = await getMenusPerRoleByRole(req.dbconnection, role)

  if (perRole.length <= 0) throw Error(NotFoundError(`${role} is not found`))

  await deleteMenusPerRoleByRole(req.dbconnection, role)

  const menuPerRole = await Promise.all(menus.map(async menuId => await createMenuPerRole(req.dbconnection, { role, menuId })))

  res.status(200).json(menuPerRole);
};

export const deleteMenusPerRole = async (req, res) => {
  const { role } = req.params

  if (!role) throw Error(ValidationError('Role as parameter is required'))

  const menuPerRole = await deleteMenusPerRoleByRole(req.dbconnection, role)

  if (menuPerRole.affectedRows <= 0) throw Error(NotFoundError('Role is not found'))

  res.status(200).json({ message: 'Menu deleted successfully' });
};
