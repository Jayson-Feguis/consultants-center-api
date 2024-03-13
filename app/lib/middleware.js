import jwt from "jsonwebtoken";
import { getSessionByToken } from "../api/session/query.js";
import { UnauthorizedError } from "../lib/utils.js";

// Check if user has token and not expired
export async function auth(req, res, next) {

  const authToken = req.headers.authorization;

  const token = authToken && authToken.split(" ")[1];

  if (!token) throw Error(UnauthorizedError("Access Denied. No access token provided"))

  const user = await new Promise((resolve, reject) => {

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {

      if (err) reject(new Error(err.message.includes('expired') ? UnauthorizedError('Your session has expired. Please log in again') : UnauthorizedError("Invalid access token")));

      const [session] = await getSessionByToken(token);

      if (!session) reject(new Error(UnauthorizedError("Invalid access token")));

      resolve(user);
    })
  });

  req.user = user;

  req.token = token;

  next();
}