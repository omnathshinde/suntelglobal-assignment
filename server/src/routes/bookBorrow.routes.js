import express from "express";
import expressAsyncHandler from "express-async-handler";

import * as bookBorrow from "#src/controllers/bookBorrow.controller.js";
import roleAccess from "#src/middlewares/roleAccess.js";

const bookBorrowRoutes = express.Router();

bookBorrowRoutes
	.route("")
	.get(expressAsyncHandler(bookBorrow.getAll))
	.post(roleAccess("user"), expressAsyncHandler(bookBorrow.create));

bookBorrowRoutes
	.route("/:id")
	.put(roleAccess("admin"), expressAsyncHandler(bookBorrow.update));

export default bookBorrowRoutes;
