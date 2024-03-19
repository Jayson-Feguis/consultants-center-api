import jwt from "jsonwebtoken";
import { deleteAllSessionWhereTokenExpired, getSessionByToken } from "../api/session/query.js";
import { UnauthorizedError } from "../lib/utils.js";
import { rateLimit } from 'express-rate-limit'
import { ERROR_CODES } from "./constants.js";

export const limiter = (timeLimit = 5 * 60 * 1000, max = 10) => rateLimit({
  windowMs: timeLimit, // 5 minutes
  max, // Limit each IP to 10 requests per `window` (here, per 5 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { error: true, status: 500, message: "Too many requests. Please try again later." },
});

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

      // User has requested to reset their password
      if (user?.purpose === 'RESETPASSWORD') resolve(user);

      if (!session) reject(new Error(UnauthorizedError("Invalid access token")));

      resolve(user);
    })
  });

  req.user = user;
  req.token = token;

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