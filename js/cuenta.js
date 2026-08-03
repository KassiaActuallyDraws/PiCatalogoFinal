const correo = localStorage.getItem("correo");
const rol = localStorage.getItem("rol");

if (!correo || !rol) {

    alert("Debes iniciar sesión.");

    window.location.href = "sesion.html";

}

const correoHeader = document.getElementById("correo");
const correoPerfil = document.getElementById("correoPerfil");
const rolPerfil = document.getElementById("rol");
const nombreUsuario = document.getElementById("nombreUsuario");

if (correoHeader)
    correoHeader.textContent = correo;

if (correoPerfil)
    correoPerfil.textContent = correo;

if (rolPerfil)
    rolPerfil.textContent = rol;

if (nombreUsuario)
    nombreUsuario.textContent = correo.split("@")[0];

const cerrar = document.getElementById("cerrarSesion");

if (cerrar) {

    cerrar.addEventListener("click", () => {

        if (confirm("¿Deseas cerrar sesión?")) {

            localStorage.clear();

            window.location.href = "sesion.html";

        }

    });

}

if (rol === "Cliente") {

    ocultarTexto("Agregar Producto");
    ocultarTexto("Categorías");
    ocultarTexto("Marcas");
    ocultarTexto("Proveedores");
    ocultarTexto("Reportes");

}

if (rol === "Vendedor") {

    ocultarTexto("Reportes");

}

function ocultarTexto(texto) {

    const elementos = document.querySelectorAll("li");

    elementos.forEach(li => {

        if (li.textContent.trim() === texto) {

            li.style.display = "none";

        }

    });

}

cargarEstadisticas();

async function cargarEstadisticas() {

    try {

        const respuesta = await fetch("http://localhost:5129/api/dashboard");

        if (!respuesta.ok)
            return;

        const datos = await respuesta.json();

        document.getElementById("cantidadProductos").textContent = datos.productos;

        document.getElementById("cantidadCategorias").textContent = datos.categorias;

        document.getElementById("cantidadMarcas").textContent = datos.marcas;

        document.getElementById("cantidadUsuarios").textContent = datos.usuarios;

    }

    catch (error) {

        console.log("No fue posible cargar el dashboard.");

    }

}

const botones = document.querySelectorAll(".botones button");

botones.forEach(boton => {

    boton.addEventListener("click", () => {

        switch (boton.textContent.trim()) {

            case "📦 Administrar Productos":

                window.location.href = "productos.html";

                break;

            case "Nuevo Producto":

                window.location.href = "agregarProducto.html";

                break;

            case "Categorías":

                window.location.href = "categorias.html";

                break;

            case "Marcas":

                window.location.href = "marcas.html";

                break;

        }

    });

});