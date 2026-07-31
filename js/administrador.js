document.getElementById("productoForm").addEventListener("submit", async (e) => {

    e.preventDefault();

    const producto = {

        nombre: document.getElementById("nombre").value,

        descripcion: document.getElementById("descripcion").value,

        precio: Number(document.getElementById("precio").value),

        stock: Number(document.getElementById("stock").value),

        imagen: document.getElementById("imagen").value,

        idCategoria: Number(document.getElementById("categoria").value),

        idMarca: Number(document.getElementById("marca").value),

        idProveedor: Number(document.getElementById("proveedor").value)

    };

    try {

        const respuesta = await fetch(`${API}/producto`, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(producto)

        });

        const datos = await respuesta.json();

        alert(datos.mensaje);

    }

    catch {

        alert("No fue posible conectar con el servidor.");

    }

});