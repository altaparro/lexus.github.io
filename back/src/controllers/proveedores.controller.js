const Proveedores = require("../model/proveedor.model");
const express = require("express");
const app = express();

const keys = require("../settings/keys");
app.set("key", keys.key);

async function crearProveedor(req, res) {
  const dataProveedor = req.body;
  try {
    // comprobamos que no se carguen dos veces a un proovedor de la misma empresa
    const nombreExistente = await Proveedores.findOne({
      where: { nombre: dataProveedor.nombre },
    });
    const empresaExistente = await Proveedores.findOne({
      where: { empresa: dataProveedor.empresa },
    });

    if (nombreExistente && empresaExistente) {
      return res.status(409).json({
        ok: false,
        status: 409,
        message: "El proveedor ya existe",
      });
    } else {
      await Proveedores.sync();
      const crearProveedor = await Proveedores.create({
        id: dataProveedor.id,
        nombre: dataProveedor.nombre,
        cuit: dataProveedor.cuit,
        empresa: dataProveedor.empresa,
      });

      res.status(201).json({
        ok: true,
        status: 201,
        message: "Proveedor cargado",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      status: 500,
      message: "Error al crear el proveedor",
    });
  }
}

async function obtenerTodosLosProveedores(req, res) {
  try {
    const proveedores = await Proveedores.findAll();
    res.status(200).json({
      ok: true,
      status: 200,
      body: proveedores,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      status: 500,
      error: error.message,
    });
  }
}

async function actualizarProveedor(req, res) {
  try {
    const id = req.params.id;
    const dataProveedor = req.body;

    const [updateCount] = await Proveedores.update(
      {
        id: dataProveedor.id,
        nombre: dataProveedor.nombre,
        cuit: dataProveedor.cuit,
        empresa: dataProveedor.empresa,
      },
      {
        where: {
          id: id,
        },
      }
    );

    if (updateCount === 0) {
      return res.status(404).json({
        ok: false,
        status: 404,
        message: "Proveedor no encontrado",
      });
    }

    res.status(200).json({
      ok: true,
      status: 200,
      message: "Proveedor actualizado correctamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      status: 500,
      message: "Error al actualizar el proveedor",
    });
  }
}

async function eliminarProveedor(req, res) {
  try {
    const id = req.params.id;

    const eliminar = await Proveedores.destroy({
      where: {
        id: id,
      },
    });

    if (eliminar === 0) {
      return res.status(404).json({
        ok: false,
        status: 404,
        message: "Proveedor no encontrado",
      });
    }

    res.status(204).json({
      ok: true,
      status: 204,
      message: "Proveedor eliminado correctamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      status: 500,
      message: "Error al eliminar el proveedor",
    });
  }
}

module.exports = {
  crearProveedor,
  obtenerTodosLosProveedores,
  actualizarProveedor,
  eliminarProveedor,
};
