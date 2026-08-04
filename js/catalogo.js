const API="http://localhost:5129/api";

const contenedor=document.getElementById("contenedorProductos");

const buscador=document.getElementById("searchbar");

let productos=[];

document.addEventListener("DOMContentLoaded",()=>{

    cargarProductos();

});

async function cargarProductos(){

    const respuesta=await fetch(`${API}/productos`);

    productos=await respuesta.json();

    pintar(productos);

}

function pintar(lista){

    contenedor.innerHTML="";

    lista.forEach(p=>{

        contenedor.innerHTML+=`

        <div class="producto">

            <a href="dato${p.id}.html">

                <img src="${p.imagen}">

            </a>

            <p>${p.nombre}</p>

            <span>$${Number(p.precio).toFixed(2)}</span>

        </div>

        `;

    });

}

buscador.addEventListener("input",()=>{

    const texto=buscador.value.toLowerCase();

    const filtrados=productos.filter(p=>

        p.nombre.toLowerCase().includes(texto)

        ||

        p.categoria.toLowerCase().includes(texto)

    );

    pintar(filtrados);

});