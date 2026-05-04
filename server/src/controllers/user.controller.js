import { Op } from "sequelize";

import { User } from "#src/index.js";

export const getAll = async (req, res) => {
	const { offset = 0, limit = 10, name, username } = req.query;
	const where = {};
	if (name) {
		where.name = { [Op.like]: `%${name}%` };
	}

	if (username) {
		where.username = { [Op.like]: `%${username}%` };
	}
	const data = await User.findAndCountAll({
		where,
		offset: Number(offset),
		limit: Number(limit),
		order: [["createdAt", "DESC"]],
	});

	return res.sendSuccess(200, data);
};

export const create = async (req, res) => {
	await User.create(req.body);
	return res.sendSuccess(200, "User created successfully");
};

export const update = async (req, res) => {
	const data = await User.update(req.body, { where: { id: req.params.id } });
	if (data[0] === 0) {
		return res.sendError(404, "User not found");
	}
	return res.sendSuccess(200, "User updated successfully");
};

export const destroy = async (req, res) => {
	const data = await User.destroy({
		where: { id: req.params.id },
		force: true, // for hard delete
	});
	if (!data) {
		return res.sendError(404, "User not found");
	}
	return res.sendSuccess(200, "User deleted successfully");
};

export const restore = async (req, res) => {
	const data = await User.restore({ where: { id: req.params.id } });
	if (!data) {
		return res.sendError(404, "User not found");
	}
	return res.sendSuccess(200, "User restored successfully");
};

export const bulkCreate = async (req, res) => {
	const data = await User.bulkCreate(req.body, { ignoreDuplicates: true });
	return res.sendSuccess(201, `${data.length} users created successfully`);
};
