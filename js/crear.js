if (localStorage.getItem("usuario")) {
    window.location.href = "perfil.html";
}

document.getElementById("crearForm").addEventListener("submit", function(event) {
    event.preventDefault();

    var usuario = document.getElementById("txt-usuario").value;
    var contrasena = document.getElementById("txt-contrasena").value;

    localStorage.setItem("usuario", usuario);
    window.location.href = "tienda.html";
});