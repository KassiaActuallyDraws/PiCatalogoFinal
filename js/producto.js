const API = "http://localhost:5129/api";

const tabla =
document.getElementById("tablaProductos");

const buscador =
document.getElementById("buscarProducto");

const btnNuevo =
document.getElementById("nuevoProducto");

const rol = localStorage.getItem("rol");

let productos = [];

let productosFiltrados = [];

document.addEventListener("DOMContentLoaded", iniciar);

async function iniciar(){

    await cargarProductos();

    eventos();

}

function eventos(){

    if(btnNuevo){

        btnNuevo.addEventListener("click",abrirNuevoProducto);

    }

    if(buscador){

        buscador.addEventListener("keyup",filtrarProductos);

    }

}

async function cargarProductos(){

    try{

        const respuesta =
        await fetch(`${API}/productos`);

        if(!respuesta.ok){

            throw new Error();

        }

        productos =
        await respuesta.json();

        productosFiltrados=[...productos];

        dibujarTabla(productosFiltrados);

    }

    catch(error){

        console.error(error);

        alert("No fue posible cargar los productos.");

    }

}

function dibujarTabla(lista){

    tabla.innerHTML="";

    if(lista.length===0){

        tabla.innerHTML=

        `

        <tr>

            <td colspan="7">

                No existen productos.

            </td>

        </tr>

        `;

        return;

    }

    lista.forEach(producto=>{

        tabla.innerHTML+=`

        <tr>

            <td>

                ${producto.id}

            </td>

            <td>

                <img

                src="${producto.imagen}"

                class="producto-img"

                onerror="this.src='images/productos/default.png'">

            </td>

            <td>

                ${producto.nombre}

            </td>

            <td>

                $${Number(producto.precio).toFixed(2)}

            </td>

            <td>

                ${producto.stock}

            </td>

            <td>

                ${producto.categoria}

            </td>

            <td>

                <button

                    class="btn-editar" 

                    onclick="editarProducto(${producto.id})">

                    ✏️

                </button>

                <button

                    class="btn-eliminar" data-tab="nuevo"

                    onclick="eliminarProducto(${producto.id})">

                    🗑️

                </button>

            </td>

        </tr>

        `;

    });

}


function filtrarProductos(){

    const texto=

    buscador.value.toLowerCase();

    productosFiltrados=

    productos.filter(producto=>

        producto.nombre

        .toLowerCase()

        .includes(texto)

        ||

        producto.categoria

        .toLowerCase()

        .includes(texto)

    );

    dibujarTabla(productosFiltrados);

}

function abrirNuevoProducto(){

    abrirModal();

}

const modal =
document.getElementById("modalProducto");

const tituloModal =
document.getElementById("tituloModal");

const formulario =
document.getElementById("formProducto");

const btnCerrar =
document.getElementById("cerrarModal");

const btnCancelar =
document.getElementById("cancelarProducto");

const txtId =
document.getElementById("productoId");

const txtNombre =
document.getElementById("nombreProducto");

const txtDescripcion =
document.getElementById("descripcionProducto");

const txtPrecio =
document.getElementById("precioProducto");

const txtStock =
document.getElementById("stockProducto");

const txtCategoria =
document.getElementById("categoriaProducto");

const txtMarca =
document.getElementById("marcaProducto");

const txtProveedor =
document.getElementById("proveedorProducto");

const txtImagen = document.getElementById("archivoImagen");
const preview = document.getElementById("previewProducto");

let modoEditar = false;
let imagenActual = "";

if (btnCerrar) {
    btnCerrar.addEventListener("click", cerrarModal);
}

if (btnCancelar) {
    btnCancelar.addEventListener("click", cerrarModal);
}

window.addEventListener("click", (e) => {
    if (e.target === modal) {
        cerrarModal();
    }
});

if (txtImagen) {
    txtImagen.addEventListener("change", () => {
        if (txtImagen.files.length === 0) {
            preview.src = modoEditar && imagenActual ? imagenActual : "images/productos/default.png";
            return;
        }

        const lector = new FileReader();
        lector.onload = (e) => {
            preview.src = e.target.result;
        };
        lector.readAsDataURL(txtImagen.files[0]);
    });
}

function abrirModal() {
    if (!modal) return;
    modal.style.display = "flex";
}

function cerrarModal() {
    if (!modal) return;
    modal.style.display = "none";
    formulario.reset();
    txtId.value = "";
    modoEditar = false;
    imagenActual = "";
    preview.src = "images/productos/default.png";
}

function abrirNuevoProducto() {
    modoEditar = false;
    imagenActual = "";
    tituloModal.textContent = "Agregar Producto";
    formulario.reset();
    txtId.value = "";
    preview.src = "images/productos/default.png";
    abrirModal();
}

async function editarProducto(id) {
    try {
        const respuesta = await fetch(`${API}/producto/${id}`);
        if (!respuesta.ok) {
            throw new Error("Error al obtener los datos del producto.");
        }

        const producto = await respuesta.json();
        modoEditar = true;
        tituloModal.textContent = "Editar Producto";
        txtId.value = producto.id;
        txtNombre.value = producto.nombre;
        txtDescripcion.value = producto.descripcion;
        txtPrecio.value = producto.precio;
        txtStock.value = producto.stock;
        txtCategoria.value = producto.categoria;
        txtMarca.value = producto.marca;
        txtProveedor.value = producto.proveedor;
        
        imagenActual = producto.imagen || "images/productos/default.png";
        preview.src = imagenActual;

        abrirModal();
    } catch (error) {
        console.error(error);
        alert("No fue posible abrir el producto para su edición.");
    }
}

if (formulario) {
    formulario.addEventListener("submit", guardarProducto);
}

async function guardarProducto(e) {
    e.preventDefault();

    try {
        const rutaImagen = await subirImagen();

        const datos = {
            nombre: txtNombre.value.trim(),
            descripcion: txtDescripcion.value.trim(),
            precio: parseFloat(txtPrecio.value),
            stock: parseInt(txtStock.value),
            imagen: rutaImagen,
            idCategoria: parseInt(txtCategoria.value),
            idMarca: parseInt(txtMarca.value),
            idProveedor: parseInt(txtProveedor.value)
        };

        if (
            datos.nombre === "" ||
            isNaN(datos.precio) ||
            isNaN(datos.stock) ||
            isNaN(datos.idCategoria) ||
            isNaN(datos.idMarca) ||
            isNaN(datos.idProveedor)
        ) {
            alert("Por favor completa toda la información requerida correctamente.");
            return;
        }

        let respuesta;
        if (modoEditar) {
            respuesta = await fetch(`${API}/producto/${txtId.value}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datos)
            });
        } else {
            respuesta = await fetch(`${API}/producto`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datos)
            });
        }

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            alert(resultado.mensaje || "Ocurrió un error al guardar los cambios.");
            return;
        }

        alert(resultado.mensaje);
        cerrarModal();
        await cargarProductos();
    } catch (error) {
        console.error(error);
        alert(error.message || "No fue posible guardar el producto.");
    }
}

async function eliminarProducto(id) {
    if (!confirm("¿Deseas eliminar este producto?")) {
        return;
    }

    try {
        const respuesta = await fetch(`${API}/producto/${id}`, {
            method: "DELETE"
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            alert(resultado.mensaje || "Error al eliminar.");
            return;
        }

        alert(resultado.mensaje);
        await cargarProductos();
    } catch (error) {
        console.error(error);
        alert("No fue posible eliminar el producto.");
    }
}

async function actualizarTabla(){

    await cargarProductos();

}

function limpiarFormulario() {
    if (formulario) {
        formulario.reset();
    }
    txtId.value = "";
    modoEditar = false;
    imagenActual = "";
    if (preview) {
        preview.src = "images/productos/default.png";
    }
}

async function subirImagen() {
    // Si no se seleccionó archivo nuevo al editar, conservamos la imagen actual del producto
    if (!txtImagen || txtImagen.files.length === 0) {
        if (modoEditar && imagenActual) {
            return imagenActual;
        }
        return "images/productos/default.png";
    }

    const formData = new FormData();
    formData.append("archivo", txtImagen.files[0]);

    const respuesta = await fetch(`${API}/subir-imagen`, {
        method: "POST",
        body: formData
    });

    const texto = await respuesta.text();

    if (!respuesta.ok) {
        throw new Error("No se pudo subir la imagen al servidor: " + texto);
    }

    const datos = JSON.parse(texto);
    // Retornamos la ruta accesible desde la API
    return `http://localhost:5129/${datos.ruta}`;
}

if (rol === "Vendedor") {

    const botonMercado = document.querySelector('[data-tab="nuevo"]');
    

    if (botonMercado) {

        botonMercado.style.display = "none";

    }

}