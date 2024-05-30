import { ACTIONS } from "../../lib/constants.js";
import { encryptPassword, NotFoundError, paginateTable, transformResponse, ValidationError } from "../../lib/utils.js";
import { createAuditTrail } from "../audit_trail/query.js";
import { getMediaById } from "../media/query.js";
import { getUserById, getUsersForAnnouncement, updateUserPasswordById, updateUserProfileById } from "./query.js";
import { validateChangePassword, validateChangeProfile } from "./validation.js";
import bcrypt from 'bcrypt'
import _ from 'lodash'
import defaultDbConnection from '../../config/db.config.js'

export const allUsers = async (req, res) => {
  const { page, limit } = req.query;

  const users = await paginateTable('users', ['id', 'email', 'firstName', 'lastName', 'createdAt', 'updatedAt'], page ? +page : undefined, limit ? +limit : undefined)

  res.status(200).json(users);
};

export const getUserForAnnouncement = async (req, res) => {
  const users = await getUsersForAnnouncement(req.dbconnection)

  res.status(200).json(transformResponse(users));
};

export const getUsersById = async (req, res) => {
  let [user] = await getUserById(req.dbconnection, req.params?.id)

  user = _.omit(user, ['upswd', 'udb'])

  if (_.has(user, 'uprofilepic')) {
    const [profile] = await getMediaById(req.dbconnection, user.uprofilepic)
    user.uprofilepic = profile
  }

  res.status(200).json(transformResponse(user));
};

export const changePassword = async (req, res) => {
  await validateChangePassword(req.body)

  const { oldPassword, newPassword } = req.body;

  const [user] = await getUserById(req.dbconnection, req.user.id)

  if (!user) throw Error(NotFoundError('User not found'))

  if (!(bcrypt.compareSync(oldPassword, user.upswd))) throw Error(ValidationError('Invalid old password'))

  const encryptedPassword = encryptPassword(newPassword);

  await Promise.all([updateUserPasswordById(defaultDbConnection, req.user.id, encryptedPassword), updateUserPasswordById(req.dbconnection, req.user.id, encryptedPassword), createAuditTrail(req, 'Change Password', 'users', req.user.id, ACTIONS.UPDATE, user.upswd, encryptedPassword)])

  res.status(200).json({ message: 'You have changed your password successfully' });
};

export const changeProfile = async (req, res) => {
  await validateChangeProfile(req.body)

  const { profilePicture, firstName, lastName } = req.body;

  const [oldUser] = await getUserById(req.dbconnection, req.user.id)

  const [updatedUser] = await updateUserProfileById(req.dbconnection, req.user.id, profilePicture, firstName, lastName)

  await Promise.all([updateUserProfileById(defaultDbConnection, req.user.id, profilePicture, firstName, lastName), createAuditTrail(req, 'Change Profile', 'uacc', req.user.id, ACTIONS.UPDATE, JSON.stringify({ uprofilepic: oldUser.uprofilepic, ufname: oldUser.ufname, ulname: oldUser.ulname }), JSON.stringify({ uprofilepic: profilePicture, ufname: firstName, ulname: lastName }))])

  const [profPic] = await getMediaById(req.dbconnection, updatedUser.uprofilepic)

  updatedUser.uprofilepic = profPic ?? {}

  res.status(200).json(_.omit(updatedUser, ['upswd']));
};
