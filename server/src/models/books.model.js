import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
	class Books extends Model {
		static associate({ BookBorrow }) {
			this.hasMany(BookBorrow, {
				foreignKey: "bookId",
				as: "borrowHistory",
				onDelete: "CASCADE",
			});
		}
	}

	Books.init(
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true,
			},

			title: {
				type: DataTypes.STRING,
				allowNull: true,
				validate: {
					notEmpty: {
						msg: "Title is required",
					},
				},
			},

			author: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notEmpty: {
						msg: "Author is required",
					},
				},
			},

			status: {
				type: DataTypes.ENUM("available", "borrowed"),
				defaultValue: "available",
			},

			publishedYear: {
				type: DataTypes.INTEGER,
				allowNull: false,
				validate: {
					isInt: {
						msg: "Published year must be a number",
					},
					min: 1000,
					max: new Date().getFullYear(),
				},
			},
		},
		{
			sequelize,
			modelName: "Books",
			indexes: [
				{
					unique: true,
					fields: ["title", "author"],
					name: "unique_title_author",
				},
			],
		},
	);

	return Books;
};
