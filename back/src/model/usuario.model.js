const { Model, DataTypes } = require("sequelize");
const sequelize = require('../conexion/conexion');



class Usuario extends Model {}

Usuario.init(
  {
    usuario_id: {
      type: DataTypes.INTEGER,
    //   defaultValue: DataTypes.UUIDV4, //autoincrementable generando un id codificado
      autoIncrement: true,
      primaryKey: true,
    },
    usuario: {
      type: DataTypes.STRING,
      allowNull: false, // no puede ser nulo
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false, // no puede ser nulo
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false, // no puede ser nulo
    },
    rol: {
      type: DataTypes.INTEGER,  
      allowNull: false,
    }
   
  },
  {
    sequelize,
    modelName: "Usuario",
  }
);


module.exports = Usuario;