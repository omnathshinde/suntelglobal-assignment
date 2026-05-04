import { Op } from "sequelize";

import { Books } from "#src/index.js";

export const getAll = async (req, res) => {
	const { offset = 0, limit = 10, title, author } = req.query;
	const where = {};
	if (title) {
		where.title = { [Op.like]: `%${title}%` };
	}

	if (author) {
		where.author = { [Op.like]: `%${author}%` };
	}
	const data = await Books.findAndCountAll({
		where,
		offset: Number(offset),
		limit: Number(limit),
		order: [["createdAt", "DESC"]],
	});

	return res.sendSuccess(200, data);
};

export const create = async (req, res) => {
	await Books.create(req.body);
	return res.sendSuccess(200, "Books created successfully");
};

export const update = async (req, res) => {
	const data = await Books.update(req.body, { where: { id: req.params.id } });
	if (data[0] === 0) {
		return res.sendError(404, "Books not found");
	}
	return res.sendSuccess(200, "Books updated successfully");
};

export const destroy = async (req, res) => {
	const data = await Books.destroy({
		where: { id: req.params.id },
		force: true, // for hard delete
	});
	if (!data) {
		return res.sendError(404, "Books not found");
	}
	return res.sendSuccess(200, "Books deleted successfully");
};
