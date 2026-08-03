const correo = localStorage.getItem("correo");
const rol = localStorage.getItem("rol");

if (!correo || !rol) {

    alert("Debes iniciar sesión.");

    window.location.href = "sesion.html";

}

document.getElementById("correoPerfil").textContent = correo;

document.getElementById("rol").textContent = rol;

const nuevoCorreo = document.getElementById("nuevoCorreo");

if (nuevoCorreo)
    nuevoCorreo.value = correo;

const botones = document.querySelectorAll(".menu-btn");

const pestañas = document.querySelectorAll(".tab");

botones.forEach(boton => {

    boton.addEventListener("click", () => {

        botones.forEach(b => b.classList.remove("activo"));

        pestañas.forEach(t => t.classList.remove("activa"));

        // Activar botón seleccionado

        boton.classList.add("activo");

        // Mostrar pestaña

        const id = boton.dataset.tab;

        document.getElementById(id).classList.add("activa");

    });

});

document.getElementById("guardarPerfil").addEventListener("click", async () => {

    const datos = {

        correo: document.getElementById("nuevoCorreo").value,

        contrasena: document.getElementById("nuevaContrasena").value

    };

    try{

        const respuesta = await fetch("http://localhost:5129/api/perfil",{

            method:"PUT",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify(datos)

        });

        if(respuesta.ok){

            alert("Perfil actualizado.");

            localStorage.setItem("correo",datos.correo);

            location.reload();

        }

        else{

            alert("No fue posible actualizar.");

        }

    }

    catch{

        alert("No se pudo conectar con el servidor.");

    }

});

const lista = document.getElementById("listaVistos");

if (lista) {

    lista.innerHTML = `

        <div class="item">

            Pato Vaquero

        </div>

        <div class="item">

            Peluche Miku

        </div>

        <div class="item">

            Pistolas de Agua

        </div>

    `;

}

const ubicaciones = document.getElementById("listaUbicaciones");

if (ubicaciones) {

    ubicaciones.innerHTML = `

        <div class="item">

            Reynosa, Tamaulipas

        </div>

    `;

}

if (rol === "Cliente") {

    const botonMercado = document.querySelector('[data-tab="mercado"]');

    if (botonMercado) {

        botonMercado.style.display = "none";

    }

}
else{

    cargarDashboard();

}

async function cargarDashboard(){

    try{

        const respuesta = await fetch("http://localhost:5129/api/dashboard");

        if(!respuesta.ok)
            return;

        const datos = await respuesta.json();

        document.getElementById("totalProductos").textContent = datos.productos;

        document.getElementById("totalCategorias").textContent = datos.categorias;

        document.getElementById("totalMarcas").textContent = datos.marcas;

        document.getElementById("totalUsuarios").textContent = datos.usuarios;

    }

    catch{

        console.log("No fue posible cargar el dashboard.");

    }

}

document.getElementById("cerrarSesion").onclick=()=>{

    if(confirm("¿Cerrar sesión?")){

        localStorage.clear();

        location.href="sesion.html";

    }

};

const modal = document.getElementById("modalProducto");

const btnNuevoProducto = document.getElementById("btnNuevoProducto");

if(btnNuevoProducto){

    btnNuevoProducto.onclick = () =>{

        modal.style.display = "flex";

    };

}

document.getElementById("cerrarModal").onclick = () => {

    modal.style.display = "none";

};

const cerrar = document.getElementById("cerrarModal");

const cancelar = document.getElementById("cancelarProducto");

if(cerrar){

    cerrar.onclick=()=>{

        modal.style.display="none";

    };

}

if(cancelar){

    cancelar.onclick=()=>{

        modal.style.display="none";

    };

}

window.onclick = (e) => {

    if(e.target == modal){

        modal.style.display = "none";

    }

};

const archivo = document.getElementById("archivoImagen");

if(archivo){

    archivo.addEventListener("change",function(){

        const imagen=this.files[0];

        if(!imagen){

            return;

        }

        const lector=new FileReader();

        lector.onload=(e)=>{

            document.getElementById("previewProducto").src=

            e.target.result;

        };

        lector.readAsDataURL(imagen);

    });

}