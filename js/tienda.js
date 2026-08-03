async function cargarProductos() {

    try {

        const respuesta = await fetch(`${API}/productos`);

        const productos = await respuesta.json();

        console.log(productos);

        // Aquí después construiremos las tarjetas automáticamente.

    }

    catch {

        alert("No fue posible cargar los productos.");

    }

}

cargarProductos();