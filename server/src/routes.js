import { Router } from "express";

import bookBorrowRoutes from "#src/routes/bookBorrow.routes.js";
import booksRoutes from "#src/routes/books.routes.js";
import userRoutes from "#src/routes/user.routes.js";

const routes = Router();

routes.use("/user", userRoutes);
routes.use("/books", booksRoutes);
routes.use("/books-borrow", bookBorrowRoutes);

export default routes;
