import express from "express";
import expressAsyncHandler from "express-async-handler";

import * as books from "#src/controllers/books.controller.js";
import roleAccess from "#src/middlewares/roleAccess.js";

const booksRoutes = express.Router();

booksRoutes
	.route("")
	.get(expressAsyncHandler(books.getAll))
	.post(roleAccess("admin"), expressAsyncHandler(books.create));

booksRoutes
	.route("/:id")
	.put(roleAccess("admin"), expressAsyncHandler(books.update))
	.delete(roleAccess("admin"), expressAsyncHandler(books.destroy));

export default booksRoutes;
