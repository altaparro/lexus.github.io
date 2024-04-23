const {  Model, DataTypes } = require("sequelize");

const sequelize = require('../conexion/conexion');
class Proveedores extends Model {}

Proveedores.init(
  {
    id: {
      type: DataTypes.INTEGER,
    //   defaultValue: DataTypes.UUIDV4, //autoincrementable
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false, // no puede ser nulo
    },
    cuit: {
        type: DataTypes.STRING,
        allowNull: false, // no puede ser nulo
    },
    empresa: {
        type: DataTypes.STRING,
        allowNull: false, // no puede ser nulo
    }
 
    },
   
  {
    sequelize,
    modelName: "Proveedores",
  }
);

module.exports = Proveedores;

async function testConnection(){
    try {
        await sequelize.authenticate()
        console.log("conexion correcta");
      } catch (err) {
        console.error("algo salio mal", err);
      }
  }

  testConnection();