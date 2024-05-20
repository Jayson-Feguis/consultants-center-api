import jwt from "jsonwebtoken";
import { deleteAllSessionWhereTokenExpired, getSessionByToken } from "../api/session/query.js";
import { NotFoundError, UnauthorizedError } from "../lib/utils.js";
import { rateLimit } from 'express-rate-limit'
import { APPROVER, ERROR_CODES, ROLES } from "./constants.js";
import { getUserById } from "../api/user/query.js";
import mysql from 'mysql2'
import dotenv from 'dotenv'
import defaultDbConnection from '../config/db.config.js'
import multer from "multer";
import path from "path";

dotenv.config();

export const limiter = (timeLimit = 5 * 60 * 1000, max = 10) => rateLimit({
  windowMs: timeLimit, // 5 minutes
  max, // Limit each IP to 10 requests per `window` (here, per 5 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { error: true, status: 500, message: "Too many requests. Please try again later." },
});

export const uploadImage = multer({
  storage: multer.memoryStorage(),
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (
      ext !== ".PNG" &&
      ext !== ".JPEG" &&
      ext !== ".JPG" &&
      ext !== ".HEIC" &&
      ext !== ".WEBP" &&
      ext !== ".png" &&
      ext !== ".jpeg" &&
      ext !== ".jpg" &&
      ext !== ".heic" &&
      ext !== ".webp"
    ) {
      return callback(
        new Error(`File must be in JPEG, JPG, PNG, or HEIC.`)
      );
    }
    callback(null, true);
  },
  limits: {
    fileSize: 1000 * 1000 * 1, // accept file with 4MB size,
  },
})

export const uploadFiles = multer({
  storage: multer.memoryStorage()
})

// Object to store connection pools for different databases
const connectionPools = {};

// Check if user has db then connect it
export async function dbConnection(req, res, next) {
  const [user] = await getUserById(defaultDbConnection, req.user.id)

  if (!user.udb) throw Error(NotFoundError('No database has been specified'))

  // Create a new connection pool if it doesn't exist for the user's database
  if (!connectionPools[user.udb]) {
    connectionPools[user.udb] = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: user.udb,
    }).promise();
  }

  req.dbconnection = connectionPools[user.udb];

  next();
}

// Check if user has token and not expired
export async function auth(req, res, next) {
  const authToken = req.headers.authorization;

  const token = authToken && authToken.split(" ")[1];

  if (!token || !authToken) throw Error(UnauthorizedError("Access Denied. No access token provided"))

  const user = await new Promise((resolve, reject) => {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
      const [session] = await getSessionByToken(token);

      if (err) {
        if (err.message.includes('expired')) reject(new Error(UnauthorizedError('Your token has expired')))
        else reject(new Error(UnauthorizedError("Invalid access token")))
      };

      if (!session) reject(new Error(UnauthorizedError("Invalid access token")));

      resolve(user);
    })
  });

  req.user = user;
  req.token = token;

  next();
}

// Check if user has token and not expired
export async function isHR(req, res, next) {
  if (req.user.role !== ROLES.HR) throw new Error(UnauthorizedError('Unauthorized to access this route'))

  next();
}

export async function isApprover(req, res, next) {
  if (!req.user.approver || req.user.approver === APPROVER.CONSULTANT || req.user.approver === APPROVER.MD_APPROVER) throw new Error(UnauthorizedError('You are not an approver'))

  next();
}

// Delete session if the token is expired
export async function deleteSessions(req, res, next) {
  await deleteAllSessionWhereTokenExpired()

  next();
}


export function errorHandler(err, req, res, next) {
  console.error(err.stack)

  const code = ERROR_CODES[err?.message?.split(':')[0]]

  res.status(code ?? 500).json({ error: true, status: code ?? 500, message: err?.message ? err?.message : 'ServerError: Something went wrong!' })
}