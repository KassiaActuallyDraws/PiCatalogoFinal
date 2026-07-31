document
.getElementById("registroForm")
.addEventListener("submit", async (e)=>{

e.preventDefault();

const usuario={

correo:
document.getElementById("txt-correo").value,

contrasena:
document.getElementById("txt-contrasena").value

};

try{

const respuesta =
await fetch("http://localhost:5129/api/registro", {

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify(usuario)

});

const datos=
await respuesta.json();

alert(datos.mensaje);

if(respuesta.ok){

window.location.href="sesion.html";

}

}
catch(error){

console.error(error);

alert("No fue posible conectar con el servidor.");

}

});