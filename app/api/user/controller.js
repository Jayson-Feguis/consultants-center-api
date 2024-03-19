import { ACTIONS } from "../../lib/constants.js";
import { encryptPassword, NotFoundError, paginateTable, ValidationError } from "../../lib/utils.js";
import { createAuditTrail } from "../audit_trail/query.js";
import { getMediaById } from "../media/query.js";
import { getUserAndRoleByEmail, getUserById, updateUserPasswordById, updateUserProfileById } from "./query.js";
import { validateChangePassword, validateChangeProfile } from "./validation.js";
import bcrypt from 'bcrypt'
import _ from 'lodash'

export const allUsers = async (req, res) => {
  const { page, limit } = req.query;

  const users = await paginateTable('users', ['id', 'email', 'firstName', 'lastName', 'createdAt', 'updatedAt'], page ? +page : undefined, limit ? +limit : undefined)

  res.json(users);
};

export const changePassword = async (req, res) => {
  await validateChangePassword(req.body)

  const { oldPassword, newPassword } = req.body;

  const [user] = await getUserById(req.user.id)

  if (!user) throw Error(NotFoundError('User not found'))

  if (!(bcrypt.compareSync(oldPassword, user.password))) throw Error(ValidationError('Invalid old password'))

  const encryptedPassword = encryptPassword(newPassword);

  await Promise.all([updateUserPasswordById(req.user.id, encryptedPassword), createAuditTrail(req, 'Change Password', 'users', req.user.id, ACTIONS.UPDATE, user.password, encryptedPassword)])

  res.status(200).json({ message: 'You have changed your password successfully' });
};

export const changeProfile = async (req, res) => {
  await validateChangeProfile(req.body)

  const { profilePicture, firstName, lastName } = req.body;

  const [oldUser] = await getUserById(req.user.id)

  const [updatedUser] = await updateUserProfileById(req.user.id, profilePicture, firstName, lastName)

  await createAuditTrail(req, 'Change Profile', 'users', req.user.id, ACTIONS.UPDATE, JSON.stringify({ profilePicture: oldUser.profilePicture, firstName: oldUser.firstName, lastName: oldUser.lastName }), JSON.stringify({ profilePicture, firstName, lastName }))

  const [profPic] = await getMediaById(updatedUser.profilePicture)

  updatedUser.profilePicture = profPic?.filePath ?? ""

  res.status(200).json(_.omit(updatedUser, ['password', 'roleId', 'role']));
};
