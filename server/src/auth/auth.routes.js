import express from "express";

import { loginLimiter } from "#base/middlewares/rateLimitHandler.js";
import { login, register } from "#src/auth/auth.controller.js";

const router = express.Router();

router.post("/login", loginLimiter, login);
router.post("/register", loginLimiter, register);

export default router;
