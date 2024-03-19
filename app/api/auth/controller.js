import bcrypt from "bcrypt";
import { encryptPassword, generateAccessToken, ValidationError, sendEmail, NotFoundError } from "../../lib/utils.js";
import { createSession } from "../session/query.js";
import { createUser, getUserAndRoleByEmail, getUserByEmail, updateUserPasswordById } from "../user/query.js";
import _ from 'lodash'
import jwt from 'jsonwebtoken'
import { validateForgotPassword, validateLogin, validateResetPassword } from "./validation.js";
import { deleteSessionByUserId } from '../session/query.js'
import { getEmailTemplateByCode } from "../email_template/query.js";
import { ACTIONS, EMAIL_TEMPLATE_CODE } from "../../lib/constants.js";
import { createAuditTrail } from "../audit_trail/query.js";
import { getMediaById } from "../media/query.js";

export const forgotPassword = async (req, res) => {
  await validateForgotPassword(req.body)

  const { email } = req.body

  const [user] = await getUserByEmail(email)

  if (!user) throw Error(NotFoundError('User not found'))

  const [content] = await getEmailTemplateByCode(EMAIL_TEMPLATE_CODE.RESET_PASSWORD)

  if (!content) throw Error(NotFoundError('Email template not found'))

  const accessToken = generateAccessToken({ id: user.id }, '5m')
  const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const userAgent = req.headers["user-agent"];
  const html = content.html.replaceAll('{url}', process.env.FRONTEND_URL).replaceAll('{token}', accessToken)

  const token = await new Promise((resolve) => {
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
      resolve(user);
    })
  });

  await Promise.all([createSession(user.id, userAgent, ipAddress, accessToken, token.exp), sendEmail(email, 'Testing', html)])

  res.status(200).json({ message: 'Your reset password link has been sent to your email!' });
};


export const login = async (req, res) => {
  await validateLogin(req.body)

  const { email, password } = req.body

  if (!email || !password) throw Error(ValidationError('Email and password should not be empty'))

  const [user] = await getUserAndRoleByEmail(email)

  console.log(user)

  if (!user || !(bcrypt.compareSync(password, user.password))) throw Error('Invalid email and password')

  const accessToken = generateAccessToken({ id: user.id, role: user.roleId })
  const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const userAgent = req.headers["user-agent"];

  delete user.password

  const [profilePicture] = await getMediaById(user.profilePicture)

  user.profilePicture = profilePicture?.filePath ?? ""

  const token = await new Promise((resolve) => {
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
      resolve(user);
    })
  });

  await createSession(user.id, userAgent, ipAddress, accessToken, token.exp)

  res.header("Authorization", "Bearer " + accessToken)

  res.status(200).json({
    jwt: accessToken,
    user: _.omit(user, ['password', 'roleId', 'role'])
  });
};

export const register = async (req, res) => {
  const encryptedPassword = encryptPassword('!Jayson123');

  const user = await createUser(2, 'Jayson', 'Feguis', 'jysnbbdllfgs@gmail.com', encryptedPassword)

  res.status(201).json(user);
};

export const resetPassword = async (req, res) => {
  await validateResetPassword(req.body)

  const { password } = req.body

  const encryptedPassword = encryptPassword(password);

  await Promise.all([updateUserPasswordById(req.user.id, encryptedPassword), deleteSessionByUserId(req.user.id), createAuditTrail(req, 'Reset Password', 'users', req.user.id, ACTIONS.UPDATE, null, encryptedPassword)])

  res.status(200).json({ message: 'Your password has been successfully reset!' })
};
