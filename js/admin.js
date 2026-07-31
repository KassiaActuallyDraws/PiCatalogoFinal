if (localStorage.getItem("usuario")) {
    window.location.href = "perfil.html";
}

document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    var usuario = document.getElementById("txt-usuario").value;
    var contrasena = document.getElementById("txt-contrasena").value;

    if (usuario === usuario && contrasena === "1234") {
        // Guardamos el nombre de usuario para poder mostrarlo en las otras
        // paginas. localStorage persiste aunque cambiemos de pagina.
        localStorage.setItem("usuario", usuario);
        window.location.href = "tienda.html";
    } else {
        alert("Usuario o contraseña incorrectos");
    }
});