document
.getElementById("loginForm")
.addEventListener("submit", async (e) => {

e.preventDefault();

const usuario = {

correo:
document.getElementById("txt-correo").value,

contrasena:
document.getElementById("txt-contrasena").value

};

try{

const respuesta = await fetch("http://localhost:5129/api/login", {

    method: "POST",

    headers: {
        "Content-Type": "application/json"
    },

    body: JSON.stringify(usuario)

});

const datos =
await respuesta.json();

if(!respuesta.ok){

alert(datos.mensaje);

return;

}

localStorage.setItem("idUsuario",datos.id);

localStorage.setItem("correo",datos.correo);

localStorage.setItem("rol",datos.rol);

window.location.href="tienda.html";

}
catch(error){

console.error(error);

alert("No fue posible conectar con el servidor.");

}

});