const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Rating = sequelize.define(
  "rating",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    rating: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
  },
  {
    underscored: true,
  },
);

module.exports = Rating;
