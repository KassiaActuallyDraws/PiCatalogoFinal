// ===== Enlace "Perfil" del menu segun la sesion =====
// Este archivo se incluye en TODAS las paginas del catalogo (tienda, juguetes,
// categorias, us). Lee el usuario guardado en localStorage al iniciar sesion
// (ver admin.js) y ajusta el enlace de Perfil de forma consistente en todo el sitio.
const enlacePerfil = document.getElementById("nom_tienda");

if (enlacePerfil) {
    const usuario = localStorage.getItem("usuario");

    if (usuario !== null) {
        // Hay sesion iniciada: mostramos el nombre y mandamos a la pagina de perfil.
        enlacePerfil.textContent = usuario;
        enlacePerfil.href = "perfil.html";
    } else {
        // No hay sesion: dejamos el enlace hacia el inicio de sesion.
        enlacePerfil.textContent = "Perfil";
        enlacePerfil.href = "sesion.html";
    }
}
