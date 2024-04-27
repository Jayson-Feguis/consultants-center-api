import bcrypt from "bcrypt";
import { encryptPassword, generateAccessToken, ValidationError, sendEmail, NotFoundError } from "../../lib/utils.js";
import { createSession } from "../session/query.js";
import { createUser, getUserAndRoleByEmail, getUserByEmail, getUserById, updateUserPasswordById } from "../user/query.js";
import _ from 'lodash'
import jwt from 'jsonwebtoken'
import { validateForgotPassword, validateLogin, validateResetPassword } from "./validation.js";
import { deleteSessionByUserId } from '../session/query.js'
import { getEmailTemplateByCode } from "../email_template/query.js";
import { ACTIONS, EMAIL_TEMPLATE_CODE } from "../../lib/constants.js";
import { createAuditTrail } from "../audit_trail/query.js";
import { getMediaById } from "../media/query.js";
import defaultDbConnection from '../../config/db.config.js'
import mysql from 'mysql2'

export const forgotPassword = async (req, res) => {
  await validateForgotPassword(req.body)

  const { email } = req.body

  const [user] = await getUserByEmail(defaultDbConnection, email)

  if (!user) throw Error(NotFoundError('User not found'))

  const [content] = await getEmailTemplateByCode(defaultDbConnection, EMAIL_TEMPLATE_CODE.RESET_PASSWORD)

  if (!content) throw Error(NotFoundError('Email template not found'))

  const accessToken = generateAccessToken({ id: user.uid }, '5m')
  const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const userAgent = req.headers["user-agent"];
  const html = content.html.replaceAll('{url}', process.env.FRONTEND_URL).replaceAll('{token}', accessToken)

  const token = await new Promise((resolve) => {
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
      resolve(user);
    })
  });

  await Promise.all([createSession(user.uid, userAgent, ipAddress, accessToken, token.exp), sendEmail(email, 'Testing', html)])


  res.status(200).json({ message: 'Your reset password link has been sent to your email!' });
};


export const login = async (req, res) => {
  await validateLogin(req.body)

  const { email, password } = req.body

  if (!email || !password) throw Error(ValidationError('Email and password should not be empty'))

  const [user] = await getUserAndRoleByEmail(defaultDbConnection, email)

  if (!user || !(bcrypt.compareSync(password, user.upswd))) throw Error('Invalid email and password')

  const accessToken = generateAccessToken({ id: user.uid, role: user.utype, approver: user.urtype })
  const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const userAgent = req.headers["user-agent"];

  const dbConnection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: user.udb
  }).promise()

  const [profilePicture] = await getMediaById(dbConnection, user.uprofilepic)

  user.uprofilepic = profilePicture ?? {}

  const token = await new Promise((resolve) => {
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
      resolve(user);
    })
  });

  await createSession(user.uid, userAgent, ipAddress, accessToken, token.exp)

  res.header("Authorization", "Bearer " + accessToken)

  res.status(200).json({
    jwt: accessToken,
    user: _.omit(user, ['upswd'])
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

  const [user] = await getUserById(defaultDbConnection, req.user.id)

  req.dbconnection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: user.udb
  }).promise()

  await Promise.all([updateUserPasswordById(defaultDbConnection, req.user.id, encryptedPassword), updateUserPasswordById(req.dbconnection, req.user.id, encryptedPassword), deleteSessionByUserId(req.user.id), createAuditTrail(req, 'Reset Password', 'uacc', req.user.id, ACTIONS.UPDATE, null, encryptedPassword)])

  res.status(200).json({ message: 'Your password has been successfully reset!' })
};
