const { DataTypes } = require("sequelize");
const sequelize = require("../database"); // Hämtar kopplingen från database.js

const Product = sequelize.define(
  "product",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    imageUrl: {
      // Detta motsvarar "image" i UML-diagrammet
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    underscored: true, // Detta ser till att Sequelize skapar "created_at" och "updated_at" automatiskt med understreck
  },
);

module.exports = Product;
