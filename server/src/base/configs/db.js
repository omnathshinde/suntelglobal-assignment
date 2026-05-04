import logger from "#base/configs/logger.js";
import sequelize from "#base/database/index.js";
import tableRelationship from "#base/helpers/TableRelationship.js";

export default async () => {
	logger.info("⏳ Connecting to database...");
	try {
		await sequelize.authenticate();
		await sequelize.sync();
		const modelNames = Object.keys(sequelize.models);
		logger.info("✅ Database connected successfully!");
		logger.info("📌 Synchronized Models:", modelNames.length ? modelNames : "None");
		logger.info("🔍 Table Relationships:");
		tableRelationship(sequelize);
	} catch (error) {
		logger.error("❌ Database connection failed:", error.message);
		logger.error("❌ Database initialization failed", {
			message: error.message,
			stack: error.stack,
		});
	} finally {
		logger.info("🧹 Database initialization attempt completed");
	}
};
