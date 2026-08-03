const API = "http://localhost:5129/api";

const formulario = document.getElementById("loginForm");

formulario.addEventListener("submit", async (e) => {

    e.preventDefault();

    const usuario = document.getElementById("txt-usuario").value.trim();

    const contrasena = document.getElementById("txt-contrasena").value;

    if (usuario === "" || contrasena === "") {

        alert("Completa todos los campos.");

        return;

    }

    try {

        const respuesta = await fetch(`${API}/login`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                usuario: usuario,

                contrasena: contrasena

            })

        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {

            alert(datos.mensaje);

            return;

        }

        localStorage.setItem("idUsuario", datos.id);
        localStorage.setItem("usuario", datos.usuario);
        localStorage.setItem("correo", datos.correo);
        localStorage.setItem("rol", datos.rol);
        localStorage.setItem("fotoPerfil", datos.fotoPerfil);

        window.location.href = "tienda.html";

    }
    catch (error) {

        console.error(error);

        alert("No fue posible conectar con el servidor.");

    }

});