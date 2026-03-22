const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Cart = sequelize.define(
  "cart",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    payed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // Standard är att den inte är betald från början
    },
  },
  {
    underscored: true,
  },
);

module.exports = Cart;
