const mp = new MercadoPago("TEST-1aedb731-9639-4152-b63d-f9d3ef14391c", {
  locale: "es-AR",
});

let productosEnCarrito = localStorage.getItem("productos-en-carrito");
productosEnCarrito = JSON.parse(productosEnCarrito);

const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector("#carrito-acciones-comprar");

function cargarProductosCarrito() {
  if (productosEnCarrito && productosEnCarrito.length > 0) {
    contenedorCarritoVacio.classList.add("disabled");
    contenedorCarritoProductos.classList.remove("disabled");
    contenedorCarritoAcciones.classList.remove("disabled");
    contenedorCarritoComprado.classList.add("disabled");

    contenedorCarritoProductos.innerHTML = "";

    productosEnCarrito.forEach((producto) => {
      const div = document.createElement("div");
      div.classList.add("carrito-producto");
      div.innerHTML = `
                <img class="carrito-producto-imagen" src="${
                  producto.imagen
                }" alt="${producto.product_name}">
                <div class="carrito-producto-titulo">
                    <small>Título</small>
                    <h3>${producto.product_name}</h3>
                </div>
                <div class="carrito-producto-cantidad">
                    <small>Cantidad</small>
                    <p>${producto.cantidad}</p>
                </div>
                <div class="carrito-producto-precio">
                    <small>Precio</small>
                    <p>$${producto.price}</p>
                </div>
                <div class="carrito-producto-subtotal">
                    <small>Subtotal</small>
                    <p>$${producto.price * producto.cantidad}</p>
                </div>
                <button class="carrito-producto-eliminar" id="${
                  producto.id
                }"><i class="bi bi-trash-fill"></i></button>
            `;

      contenedorCarritoProductos.append(div);
    });

    actualizarBotonesEliminar();
    actualizarTotal();
  } else {
    contenedorCarritoVacio.classList.remove("disabled");
    contenedorCarritoProductos.classList.add("disabled");
    contenedorCarritoAcciones.classList.add("disabled");
    contenedorCarritoComprado.classList.add("disabled");
  }
}

cargarProductosCarrito();

function actualizarBotonesEliminar() {
  botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

  botonesEliminar.forEach((boton) => {
    boton.addEventListener("click", eliminarDelCarrito);
  });
}

function alertaEliminar() {
  Swal.fire({
    position: "center",
    icon: "success",
    title: "El producto se ha eliminado con éxito!",
    showConfirmButton: false,
    timer: 1500,
  });
}

function eliminarDelCarrito(e) {
  alertaEliminar();

  const idBoton = e.currentTarget.id;
  const index = productosEnCarrito.findIndex(
    (producto) => producto.id === idBoton
  );

  productosEnCarrito.splice(index, 1);
  cargarProductosCarrito();

  localStorage.setItem(
    "productos-en-carrito",
    JSON.stringify(productosEnCarrito)
  );
}

botonVaciar.addEventListener("click", vaciarCarrito);

function vaciarCarrito() {
  const totalProductos = productosEnCarrito.reduce(
    (acc, producto) => acc + producto.cantidad,
    0
  );

  Swal.fire({
    title: "¿Estás seguro?",
    text: `Se van a borrar ${totalProductos} productos.`,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí",
    cancelButtonText: "No",
  }).then((result) => {
    if (result.isConfirmed) {
      productosEnCarrito.length = 0;
      localStorage.setItem(
        "productos-en-carrito",
        JSON.stringify(productosEnCarrito)
      );
      cargarProductosCarrito();
      Swal.fire("Carrito vaciado exitosamente.", "", "success");
    } else {
      Swal.fire("Operación cancelada.", "", "info");
    }
  });
}

function actualizarTotal() {
  const totalCalculado = productosEnCarrito.reduce(
    (acc, producto) => acc + producto.price * producto.cantidad,
    0
  );
  total.innerText = `$${totalCalculado}`;
}

botonComprar.addEventListener("click", comprarCarrito);
async function comprarCarrito() {
  const btnComprar =  document.getElementById("carrito-acciones-comprar")
  btnComprar.disabled = true;
  btnComprar.style = "background-color: grey"
  try {
    const orderData = localStorage.getItem("productos-en-carrito");
    const orderDataFinal = JSON.parse(orderData).map((producto) => {
      return {
        product_id: producto.product_id,
        cantidad: producto.cantidad,
      };
    });
    console.log(orderDataFinal);

    const response = await fetch(
      "http://localhost:6607/api/v1/create_preference",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orders: orderDataFinal }),
      }
    );

    const preference = await response.json();
    createCheckoutButton(preference.message.id);
  } catch (error) {
    alert("error", error);
  }
}

const createCheckoutButton = (preferenceId) => {
  const bricksBuilder = mp.bricks();

  const renderComponent = async () => {
    if (window.checkoutButton){
      window.checkoutButton.unmount();
    } 

    await bricksBuilder.create("wallet", "wallet_container", {
      initialization: {
        preferenceId: preferenceId,
      },
    });
  };

  renderComponent();
};
