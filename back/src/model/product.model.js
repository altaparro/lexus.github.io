const { Model, DataTypes } = require("sequelize");

const sequelize = require('../conexion/conexion');

class Product extends Model {}

Product.init(
  {
    product_id: {
      type: DataTypes.INTEGER,
    //   defaultValue: DataTypes.UUIDV4, //autoincrementable
      autoIncrement: true,
      primaryKey: true,
    },
    product_name: {
      type: DataTypes.STRING,
      allowNull: false, // no puede ser nulo
    },
    price: {
      type: DataTypes.FLOAT(10, 2),
      allowNull: false,
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    proveedor: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    imagen: {
      type: DataTypes.STRING,
      allowNull: false, // no puede ser nulo
    },
  },
  {
    sequelize,
    modelName: "Product",
  }
);

module.exports = Product;

