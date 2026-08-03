const API="http://localhost:5129/api";

const parametros=new URLSearchParams(window.location.search);

const id=parametros.get("id");

cargarProducto();

async function cargarProducto(){

    const respuesta=await fetch(`${API}/producto/${id}`);

    const producto=await respuesta.json();

    document.getElementById("nombre").value=producto.nombre;

    document.getElementById("descripcion").value=producto.descripcion;

    document.getElementById("precio").value=producto.precio;

    document.getElementById("stock").value=producto.stock;

    document.getElementById("imagen").value=producto.imagen;

}

document.getElementById("guardar").addEventListener("click",guardarProducto);

async function guardarProducto(){

    const producto={

        nombre:document.getElementById("nombre").value,

        descripcion:document.getElementById("descripcion").value,

        precio:Number(document.getElementById("precio").value),

        stock:Number(document.getElementById("stock").value),

        imagen:document.getElementById("imagen").value

    };

    const respuesta=await fetch(`${API}/producto/${id}`,{

        method:"PUT",

        headers:{

            "Content-Type":"application/json"

        },

        body:JSON.stringify(producto)

    });

    if(respuesta.ok){

        alert("Producto actualizado.");

        window.location.href="productos.html";

    }

    else{

        alert("No fue posible actualizar.");

    }

}