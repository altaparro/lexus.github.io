// Configuracion de la bdd:
require('dotenv').config();

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.NOMBRE_BD, process.env.USUARIO_BD, process.env.PASS_BD, {
  host: process.env.HOST,
  dialect: "mysql",
  port: process.env.PORT_BD,
});

module.exports = sequelize;