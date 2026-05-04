import { AdminUser } from "#base/helpers/AppAdminData.js";
import { sequelize, User } from "#src/index.js";

export default async () => {
	const transaction = await sequelize.transaction();
	try {
		const [user, userCreated] = await User.findOrCreate({
			where: { username: "admin" },
			defaults: AdminUser,
			transaction,
			raw: true,
			logging: false,
		});

		if (userCreated) console.log("🛡️ Admin created:", user.username, user.role);
		else console.log("🔰 Admin already exists:", user.username, user.role);
		await transaction.commit();
	} catch (error) {
		await transaction.rollback();

		if (error.name === "SequelizeUniqueConstraintError") {
			console.log("🔰 Admin already exists (caught unique constraint)");
		} else {
			console.error("❌ Failed to seed admin user:", error);
		}
	}
};
