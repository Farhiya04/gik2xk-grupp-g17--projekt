const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./webbshop.sqlite",
});

module.exports = sequelize;
