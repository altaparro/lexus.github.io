const url = 'http://localhost:6607/api/v1/products/obtenerTodosLosProductos'
const urlDelete = 'http://localhost:6607/api/v1/products/eliminarProducto/'
const urlCrear = 'http://localhost:6607/api/v1/products/crearProducto'
const urlEditar = 'http://localhost:6607/api/v1/products/actualizarProducto/'
const contenedor = document.querySelector('tbody')

let resultados = ''

const modalArticulo = new bootstrap.Modal(document.getElementById('modalArticulo'))
const formArticulo = document.querySelector('form')
const nombre = document.getElementById('nombre')
const precio = document.getElementById('precio')
const cantidad = document.getElementById('cantidad')
const tipo = document.getElementById('tipo')
const proveedor = document.getElementById('proveedor')
const imagen = document.getElementById('imagen')
let opcion = ''

btnCrear.addEventListener('click', () => {
    limpiarCampos()
    modalArticulo.show()
    opcion = 'crear'
})


function limpiarCampos() {
    nombre.value = ''
    precio.value = ''
    cantidad.value = ''
    tipo.value = ''
    proveedor.value = ''
    imagen.value = ''
}

const mostrar = (articulos) => {
    articulos.forEach(articulo => {
        resultados += `<tr>
                            <td>${articulo.product_id}</td>
                            <td>${articulo.product_name}</td>
                            <td>${articulo.price}</td>
                            <td>${articulo.cantidad}</td>
                            <td>${articulo.tipo}</td>
                            <td>${articulo.proveedor}</td>
                            <td>${articulo.imagen}</td>
                            <td class="text-center"><a class="btnEditar btn btn-primary">Editar</a>  <a class="btnBorrar btn btn-danger">Borrar</a></td>
                        </tr>
                      `
    })
    contenedor.innerHTML = resultados
}
// mostrar registros
fetch(url)
    .then(Response => Response.json())
    .then(data => {
        mostrar(data.body);
    })
    .catch(error => console.log(error));


const on = (element, event, selector, handler) => {
    element.addEventListener(event, e => {
        if (e.target.closest(selector)) {
            handler(e)
        }
    })
}

//proceso para eliminar
on(document, 'click', '.btnBorrar', e => {
    const fila = e.target.parentNode.parentNode
    const id = fila.firstElementChild.innerHTML
    alertify.confirm("¿Esta seguro que desea eliminar el producto?",
        function () {
            fetch(urlDelete + id, {
                method: 'DELETE'
            })
                .then(response => response.json())
                .then(() => location.reload())
        },
        function () {
            alertify.error('Cancel');
        });
})

//proceso para editar
let idForm = 0
on(document, 'click', '.btnEditar', e => {
    const fila = e.target.parentNode.parentNode
    idForm = fila.children[0].innerHTML
    const nombreForm = fila.children[1].innerHTML
    const precioForm = fila.children[2].innerHTML
    const cantidadForm = fila.children[3].innerHTML
    const tipoForm = fila.children[4].innerHTML
    const proveedorForm = fila.children[5].innerHTML
    const imagenForm = fila.children[6].innerHTML

    nombre.value = nombreForm
    precio.value = precioForm
    cantidad.value = cantidadForm
    tipo.value = tipoForm
    proveedor.value = proveedorForm
    // imagen.value=imagenruta
    opcion = 'editar'
    modalArticulo.show()

})

//proceso para crear y editar
formArticulo.addEventListener('submit', (e) => {
    e.preventDefault();
    if (opcion == 'crear') {
        let imagenruta = '';
        if (imagen.files.length > 0) {
            imagenruta = imagen.files[0].name;
        }
        fetch(urlCrear, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                product_name: nombre.value,
                price: precio.value,
                cantidad: cantidad.value,
                tipo: tipo.value,
                proveedor: proveedor.value,
                imagen: imagenruta
            })
        })
            .then(response => response.json())
            .then(data => {
                const nuevoArticulo = []
                nuevoArticulo.push(data)
                mostrar(nuevoArticulo)
            })
    }
    if (opcion == 'editar') {
        let imagenruta = imagen.value; // Conserva el valor existente por defecto
        if (imagen.files.length > 0) {
            imagenruta = imagen.files[0].name;
        }
        fetch(urlEditar + idForm, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                product_name: nombre.value,
                price: precio.value,
                cantidad: cantidad.value,
                tipo: tipo.value,
                proveedor: proveedor.value,
                imagen: imagenruta
            })
        })
            .then(response => response.json())
            .then(response => location.reload())
    }
    modalArticulo.hide()
})

