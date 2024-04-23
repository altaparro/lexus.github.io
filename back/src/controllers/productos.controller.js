const Products = require("../model/product.model");
const xl = require("excel4node");
const path = require('path');
const { Op } = require("sequelize");

async function obtenerTodosLosProductos(req, res) {
  try {
    const products = await Products.findAll({
      where: {
        cantidad: {
          [Op.gt]: 0 // 'gt' significa 'greater than' (mayor que)
        }
      }
    });
    res.status(200).json({
      ok: true,
      status: 200,
      body: products,
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

async function crearProducto(req, res) {
  try {
    const dataProducts = req.body;
    await Products.sync();
    const createProduct = await Products.create({
      product_name: dataProducts.product_name,
      price: dataProducts.price,
      is_stock: dataProducts.is_stock,
      cantidad: dataProducts.cantidad,
      tipo: dataProducts.tipo,
      proveedor: dataProducts.proveedor,
      imagen: `img\\${dataProducts.imagen}`
    });
    res.status(201).json({
      ok: true,
      status: 201,
      message: "Producto cargado",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      status: 500,
      message: "Error al crear el producto",
    });
  }
}

async function obtenerProductoPorID(req, res) {
  const id = req.params.product_id;
  console.log(id);
  try {
    
    const id = req.params.product_id;
    console.log(id);
    const producto = await Products.findOne({
      where: {
        product_id: id,
      },
    });
    
    if (!producto) {
      return res.status(404).json({
        ok: false,
        status: 404,
        message: "Producto no encontrado",
      });
    }

    res.status(200).json({
      ok: true,
      status: 200,
      body: producto,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      status: 500,
      message: "Error al obtener el producto",
    });
  }
}

async function obtenerProductoPorTipo(req, res) {
  try {
    const tipo = req.params.tipoCategoria;
    const producto = await Products.findAll({
      where: {
        tipo: tipo,
      },
    });

    if (!producto) {
      return res.status(404).json({
        ok: false,
        status: 404,
        message: "Producto no encontrado",
      });
    }

    res.status(200).json({
      ok: true,
      status: 200,
      body: producto,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      status: 500,
      message: "Error al obtener el producto",
    });
  }
}


async function actualizarProducto(req, res) {
  try {
    const id = req.params.product_id;
    const dataProducts = req.body;

    const updateFields = {
      product_name: dataProducts.product_name,
      price: dataProducts.price,
      is_stock: dataProducts.is_stock,
      cantidad: dataProducts.cantidad,
      tipo: dataProducts.tipo,
      proveedor: dataProducts.proveedor,
    };

    // Verifica si req.body.imagen no está vacío, si no lo está, agrega imagen al objeto de actualización
    if (dataProducts.imagen !== '') {
      updateFields.imagen = dataProducts.imagen;
    }

    const [updateCount] = await Products.update(updateFields, {
      where: {
        product_id: id,
      },
    });

    if (updateCount === 0) {
      return res.status(404).json({
        ok: false,
        status: 404,
        message: "Producto no encontrado",
      });
    }

    res.status(200).json({
      ok: true,
      status: 200,
      message: "Producto actualizado correctamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      status: 500,
      message: "Error al actualizar el producto",
    });
  }
}


async function eliminarProducto(req, res) {
  try {
    const id = req.params.product_id;

    const deleteCount = await Products.destroy({
      where: {
        product_id: id,
      },
    });

    if (deleteCount === 0) {
      return res.status(404).json({
        ok: false,
        status: 404,
        message: "Producto no encontrado",
      });
    }

    res.status(204).json({
      ok: true,
      status: 204,
      message: "Producto eliminado correctamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      status: 500,
      message: "Error al eliminar el producto",
    });
  }
}

//fecha configurando para excel
let date = new Date();
let fechaDia = date.getUTCDate();
let fechaMes = date.getUTCMonth() + 1;
let fechaAnio = date.getUTCFullYear();
let fechaHora = date.getUTCHours();
let fechaMinuto = date.getUTCMinutes();

async function descargarExcel(req, res) {
  //configurando
  var wb = new xl.Workbook(); //creando el libro de trabajo
  let nombreArchivo =
    "todosLosProductos" + fechaDia + "_" + fechaMes + "_" + fechaAnio + ".";
  var ws = wb.addWorksheet(nombreArchivo);

  //crear estilos
  var style1 = wb.createStyle({
    font: {
      name: "Arial",
      color: "#000000",
      size: 12,
      bold: true,
    },
  });

  var contenidoStyle = wb.createStyle({
    font: {
      name: "Arial",
      color: "#494949",
      size: 11,
    },
  });

  //Nombres de las columnas
  ws.cell(1, 1).string("id").style(style);  
  ws.cell(1, 2).string("product_name").style(style);    
  ws.cell(1, 3).string("price").style(style); 
  ws.cell(1, 4).string("cantidad").style(style); 
  ws.cell(1, 5).string("tipo").style(style); 
  ws.cell(1, 6).string("proveedor").style(style); 

  //ruta del archivo
  const pathExcel = path.join(__dirname, '../excel',nombreArchivo + '.xlsx');

  //Escribir o guardar
  wb.write(pathExcel, function(err, stats){
    if(err) console.log(err);
  });

}

module.exports = {
  obtenerTodosLosProductos,
  crearProducto,
  obtenerProductoPorID,
  actualizarProducto,
  eliminarProducto,
  obtenerProductoPorTipo
};
