import express from "express";
import expressAsyncHandler from "express-async-handler";

import * as user from "#src/controllers/user.controller.js";
import roleAccess from "#src/middlewares/roleAccess.js";

const userRoutes = express.Router();

userRoutes
	.route("")
	.get(expressAsyncHandler(user.getAll))
	.post(roleAccess("admin"), expressAsyncHandler(user.create));

userRoutes
	.route("/:id", roleAccess("admin"))
	.put(expressAsyncHandler(user.update))
	.patch(expressAsyncHandler(user.restore))
	.delete(expressAsyncHandler(user.destroy));

export default userRoutes;
