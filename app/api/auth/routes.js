import express from "express";
import { forgotPassword, login, register, resetPassword } from "./controller.js";
import multer from "multer";
import { limiter, auth } from "../../lib/middleware.js";

const endpoint = '/api/auth'
const router = express.Router();

/**
 * POST - Sends a unique link via email to allow the user to reset their password.
 * @param {string} email - The user's email.
 */
router.post(`${endpoint}/forgot-password`, limiter(2 * 60 * 1000, 3), multer().none(), forgotPassword);

/**
 * POST - Authorizes the user to access certain APIs.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 */
router.post(`${endpoint}/login`, limiter(2 * 60 * 1000, 3), multer().none(), login);

/**
 * POST - Creates a new user.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 */
router.get(`${endpoint}/register`, limiter(1 * 60 * 1000, 3), register);

/**
 * PATCH - Updates the user's password.
 * @param {string} password - The user's new password.
 * @param {string} confirmPassword - Confirmation of the new password.
 */
router.patch(`${endpoint}/reset-password`, limiter(2 * 60 * 1000, 3), auth, multer().none(), resetPassword);

export default router;