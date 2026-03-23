const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Rating = sequelize.define(
  "Rating",
  {
    // Själva siffer-betyget (1-5)
    rating: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    // för Kommentarer
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    underscored: true,
  },
);

module.exports = Rating;
