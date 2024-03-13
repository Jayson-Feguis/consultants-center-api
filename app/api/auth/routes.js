import express from "express";
import { login, register, allUsers } from "./controller.js";
import multer from "multer";
import { auth } from "../../lib/middleware.js";

const router = express.Router();

router.post("/api/auth/login", multer().none(), login);

router.get("/api/auth/register", register);

router.get("/api/users", auth, allUsers);

export default router;