import mysql from "../../config/db.config.js";
import bcrypt from "bcrypt";
import { paginateTable, generateAccessToken } from "../../lib/utils.js";
import { createSession } from "../session/query.js";
import { createUser } from "../user/query.js";

const saltRounds = 10;

export const allUsers = async (req, res) => {

  const { page, limit } = req.query;

  const users = await paginateTable('users', ['id', 'email', 'firstName', 'lastName', 'createdAt', 'updatedAt'], page ? +page : undefined, limit ? +limit : undefined)

  res.json(users);

};


export const login = async (req, res) => {

  const { email, password } = req.body

  if (!email || !password) throw Error('Email and password should not be empty')

  const [data] = await mysql.query("SELECT * from `users` where email=?", [email])

  const user = data[0]

  if (!user || !(bcrypt.compareSync(password, user.password))) throw Error('Invalid email and password')

  const accessToken = generateAccessToken({ id: user.id })

  const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  const userAgent = req.headers["user-agent"];

  delete user.password

  await createSession(user.id, userAgent, ipAddress, accessToken)

  res.status(200).json({
    jwt: accessToken,
    user
  });

};


export const register = async (req, res) => {

  const salt = bcrypt.genSaltSync(saltRounds);

  const encryptedPassword = bcrypt.hashSync('!Jayson123', salt);

  const user = await createUser('Hello', 'World', 'hello@gmail.com', encryptedPassword)

  res.status(201).json(user);

};
