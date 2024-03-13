import express from "express";
import { login, register, allUsers } from "./controller.js";
import multer from "multer";


const router = express.Router();

router.post("/api/login", multer().none(), login);

router.get("/api/register", register);

router.get("/api/users", allUsers);

export default router;