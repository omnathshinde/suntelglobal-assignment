import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
	class BookBorrow extends Model {
		static associate({ User, Books }) {
			this.belongsTo(User, {
				foreignKey: "userId",
				as: "user",
				onDelete: "CASCADE",
			});
			this.belongsTo(Books, {
				foreignKey: "bookId",
				as: "book",
				onDelete: "CASCADE",
			});
		}
	}

	BookBorrow.init(
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true,
			},

			userId: {
				type: DataTypes.UUID,
				allowNull: false,
			},

			bookId: {
				type: DataTypes.UUID,
				allowNull: false,
			},
			returnDate: {
				type: DataTypes.DATE,
				allowNull: true,
			},
			status: {
				type: DataTypes.ENUM("borrowed", "returned"),
				defaultValue: "borrowed",
			},
		},
		{
			sequelize,
			modelName: "BookBorrow",
		},
	);

	return BookBorrow;
};
