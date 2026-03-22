const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const CartRow = sequelize.define(
  "cart_row",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
  },
  {
    underscored: true,
    freezeTableName: true, // Tvingar Sequelize att heta exakt "cart_row" i databasen
  },
);

module.exports = CartRow;
