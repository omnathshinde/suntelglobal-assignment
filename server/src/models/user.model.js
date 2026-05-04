import argon2 from "argon2";
import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
	class User extends Model {
		static associate({ BookBorrow }) {
			this.hasMany(BookBorrow, {
				foreignKey: "userId",
				as: "borrowHistory",
				onDelete: "CASCADE",
			});
		}
	}

	User.init(
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			username: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			role: {
				type: DataTypes.ENUM("admin", "user"),
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: "User",
			indexes: [{ fields: ["username"] }, { fields: ["createdBy"] }],
			hooks: {
				beforeCreate: async (user) => {
					user.password = await argon2.hash(user.password);
				},
				beforeUpdate: async (user) => {
					if (user.changed("password")) {
						user.password = await argon2.hash(user.password);
					}
				},
			},
		},
	);

	return User;
};
