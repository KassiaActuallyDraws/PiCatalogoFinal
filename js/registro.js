const API = "http://localhost:5129/api";

const formulario = document.getElementById("registroForm");

formulario.addEventListener("submit", async (e) => {

    e.preventDefault();

    const usuario = document.getElementById("txt-usuario").value.trim();

    const correo = document.getElementById("txt-correo").value.trim();

    const contrasena = document.getElementById("txt-contrasena").value;

    if (usuario === "" || correo === "" || contrasena === "") {

        alert("Completa todos los campos.");

        return;

    }

    try {

        const respuesta = await fetch(`${API}/registro`, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                usuario: usuario,

                correo: correo,

                contrasena: contrasena

            })

        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {

            alert(datos.mensaje);

            return;

        }

        alert("Cuenta creada correctamente.");

        window.location.href = "sesion.html";

    }

    catch (error) {

        console.error(error);

        alert("No fue posible conectar con el servidor.");

    }

});