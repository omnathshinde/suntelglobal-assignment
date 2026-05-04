import { Op } from "sequelize";

import { BookBorrow, Books, User } from "#src/index.js";

export const getAll = async (req, res) => {
	const {
		limit = 10,
		offset = 0,
		status,
		title,
		author,
		username,
		fromDate,
		toDate,
	} = req.query;

	const user = req.user;

	const where = {};
	const bookWhere = {};
	const userWhere = {};

	// User only can see their records
	if (user.role !== "admin") {
		where.userId = user.id;
	}

	if (status) {
		where.status = status;
	}
	if (title) {
		bookWhere.title = { [Op.like]: `%${title}%` };
	}
	if (author) {
		bookWhere.author = { [Op.like]: `%${author}%` };
	}
	if (username) {
		userWhere.username = { [Op.like]: `%${username}%` };
	}
	if (fromDate && toDate) {
		where.borrowDate = {
			[Op.between]: [new Date(fromDate), new Date(toDate)],
		};
	}

	const data = await BookBorrow.findAndCountAll({
		where,
		include: [
			{
				model: Books,
				as: "book",
				attributes: ["title", "author"],
				...(Object.keys(bookWhere).length && { where: bookWhere }),
			},
			{
				model: User,
				as: "user",
				attributes: ["username"],
				...(Object.keys(userWhere).length && { where: userWhere }),
			},
		],
		limit: Number(limit),
		offset: Number(offset),
		order: [["createdAt", "DESC"]],
	});

	return res.sendSuccess(200, data);
};

export const create = async (req, res) => {
	const transaction = req.transaction;

	const { bookId } = req.body;
	const userId = req.user.id;

	const book = await Books.findByPk(bookId, { transaction });

	if (!book) {
		await transaction.rollback();
		return res.sendError(404, "Book not found");
	}

	if (book.status === "borrowed") {
		await transaction.rollback();
		return res.sendError(400, "Book already borrowed");
	}

	// prevent duplicate active borrow
	const active = await BookBorrow.findOne({
		where: { bookId, returnDate: null },
		transaction,
	});

	if (active) {
		await transaction.rollback();
		return res.sendError(400, "Book already borrowed");
	}

	await BookBorrow.create(
		{
			userId,
			bookId,
		},
		{ transaction },
	);

	await book.update({ status: "borrowed" }, { transaction });

	await transaction.commit();

	return res.sendSuccess(200, "Book borrowed successfully");
};

export const update = async (req, res) => {
	const transaction = req.transaction;
	const { id } = req.params;

	const record = await BookBorrow.findByPk(id, { transaction });

	if (!record) {
		await transaction.rollback();
		return res.sendError(404, "Record not found");
	}

	if (record.returnDate) {
		await transaction.rollback();
		return res.sendError(400, "Book already returned");
	}

	await record.update(
		{
			returnDate: new Date(),
			status: "returned",
		},
		{ transaction },
	);

	const book = await Books.findByPk(record.bookId, { transaction });

	if (!book) {
		await transaction.rollback();
		return res.sendError(404, "Book not found");
	}

	await book.update({ status: "available" }, { transaction });

	await transaction.commit();

	return res.sendSuccess(200, "Book returned successfully");
};
