const correo = localStorage.getItem("correo");

const rol = localStorage.getItem("rol");

if (!correo) {

    window.location.href = "sesion.html";

}

document.getElementById("correo").textContent = correo;

document.getElementById("rol").textContent = rol;