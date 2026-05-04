import sequelize, { tables } from "#db/index.js";

export { sequelize };
export const { BookBorrow, Books, User } = tables;
