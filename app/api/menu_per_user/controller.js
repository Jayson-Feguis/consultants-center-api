import { NotFoundError, transformResponse, ValidationError } from "../../lib/utils.js";
import { getUserById } from "../user/query.js";
import { createMenuPerUser, deleteMenusPerUserByUserId, getMenusPerUserByUser, getMenusPerUserByUserId, getUsersFromMenusPerUser } from "./query.js";
import { validateCreateMenuPerUser } from "./validation.js";
import _ from 'lodash'

export const getAllMenusPerUser = async (req, res) => {
  const userIds = await getUsersFromMenusPerUser(req.dbconnection)
  let menusPerUser = []

  if (userIds && userIds.length > 0) menusPerUser = await Promise.all(userIds.map(async userId => {
    let [user] = await getUserById(req.dbconnection, userId);
    user = _.pick(user, ['ufname', 'ulname'])
    user = `${user.ufname} ${user.ulname}`
    return ({
      id: userId,
      user,
      includedMenus: await getMenusPerUserByUser(req.dbconnection, userId, 'YES'),
      excludedMenus: await getMenusPerUserByUser(req.dbconnection, userId, 'NO')
    })
  }))

  res.status(200).json(transformResponse(menusPerUser));
};

export const createMenusPerUser = async (req, res) => {
  await validateCreateMenuPerUser(req.body)
  const { userId, includedMenus, excludedMenus } = req.body

  const perUser = await getMenusPerUserByUserId(req.dbconnection, userId)

  if (perUser.length > 0) throw Error(ValidationError(`User is already created. Please check the table`))

  await deleteMenusPerUserByUserId(req.dbconnection, userId)

  const included = await Promise.all(includedMenus.map(async menuId => await createMenuPerUser(req.dbconnection, { userId, menuId, isIncluded: 'YES' })))
  const excluded = await Promise.all(excludedMenus.map(async menuId => await createMenuPerUser(req.dbconnection, { userId, menuId, isIncluded: 'NO' })))

  res.status(201).json({ id: userId, user: userId, includedMenus: included, excludedMenus: excluded });
};

export const updateMenusPerUser = async (req, res) => {
  await validateCreateMenuPerUser({ ...req.body, ...req.params })
  const { includedMenus, excludedMenus } = req.body
  const { userId } = req.params

  if (!userId) throw Error(ValidationError('User as parameter is required'))

  const perUser = await getMenusPerUserByUserId(req.dbconnection, userId)

  if (perUser.length <= 0) throw Error(NotFoundError(`${userId} is not found`))

  await deleteMenusPerUserByUserId(req.dbconnection, userId)

  const included = await Promise.all(includedMenus.map(async menuId => await createMenuPerUser(req.dbconnection, userId, menuId, 'YES')))
  const excluded = await Promise.all(excludedMenus.map(async menuId => await createMenuPerUser(req.dbconnection, userId, menuId, 'NO')))

  res.status(201).json({ id: userId, user: userId, includedMenus: included, excludedMenus: excluded });
};

export const deleteMenusPerUser = async (req, res) => {
  const { userId } = req.params

  if (!userId) throw Error(ValidationError('User ID as parameter is required'))

  const menuPerUser = await deleteMenusPerUserByUserId(req.dbconnection, userId)

  if (menuPerUser.affectedRows <= 0) throw Error(NotFoundError('User is not found'))

  res.status(200).json({ message: 'Menu deleted successfully' });
};
