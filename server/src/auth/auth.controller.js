import argon2 from "argon2";
import jwt from "jsonwebtoken";

import env from "#base/configs/env.js";
import logger from "#base/configs/logger.js";
import { User } from "#src/index.js";

const SECRET_KEY = env.JWT_SECRET_KEY;

export const login = async (req, res) => {
	const { username, password } = req.body;

	if (!username || !password) {
		return res.sendError(400, "Username and password are required");
	}

	const user = await User.findOne({
		where: { username },
		raw: true,
	});

	if (!user || Object.keys(user).length === 0) {
		return res.sendError(404, "User not found");
	}

	const isPasswordValid = await argon2.verify(user.password, password);

	if (!isPasswordValid) {
		return res.sendError(401, "Invalid password");
	}

	const tokenData = {
		id: user.id,
		name: user.name,
		role: user.role,
		username: user.username,
	};

	const token = jwt.sign(tokenData, SECRET_KEY);
	req.user = { username: user.username };
	logger.warn("User Logged", { "Auth User": user.username });
	return res.sendSuccess(200, {
		user: tokenData,
		token,
	});
};

export const register = async (req, res) => {
	const { username, password, name } = req.body;

	if (!name) return res.sendError(400, "Name is required");
	if (!username || !password) {
		return res.sendError(400, "Username and password are required");
	}

	const user = await User.create({
		name,
		username,
		password,
		role: "user",
	});

	const tokenData = {
		id: user.id,
		name: user.name,
		role: user.role,
		username: user.username,
	};

	const token = jwt.sign(tokenData, SECRET_KEY);
	req.user = { username: user.username };
	logger.warn("User Registered", { "Auth User": user.username });
	return res.sendSuccess(200, {
		user: tokenData,
		token,
	});
};
