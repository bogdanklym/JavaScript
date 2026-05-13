const formulario = document.getElementById("formIncidencia");
const tabla = document.getElementById("tablaIncidencias");

let total = 0;
let pendientes = 0;
let entregados = 0;
let noEntregados = 0;


window.onload = function () {
    let incidencias = JSON.parse(localStorage.getItem("incidencias")) || [];

    incidencias.forEach(i => {
        crearFila(i);
        total++;
        pendientes++;
    });

    actualizarContador();
};


formulario.addEventListener("submit", function(e) {
    e.preventDefault();

    let numero = document.getElementById("numero").value.trim();
    let nombre = document.getElementById("nombre").value.trim();
    let ref = document.getElementById("ref").value.trim();
    let fecha = document.getElementById("fecha").value;
    let hora = document.getElementById("hora").value;
    let incidencia = document.getElementById("incidencia").value.trim();

    // VALIDACIÓN
    if (!/^[0-9]+$/.test(numero) || Number(numero) <= 0) {
        alert("Número inválido");
        return;
    }

    if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{3,}$/.test(nombre)) {
        alert("Nombre inválido");
        return;
    }

    if (!/^[A-Za-z0-9\-]{3,}$/.test(ref)) {
        alert("Referencia inválida");
        return;
    }

    if (fecha === "" || hora === "") {
        alert("Fecha u hora vacía");
        return;
    }

    if (incidencia.length < 5) {
        alert("Incidencia demasiado corta");
        return;
    }

    let nueva = {
        numero,
        nombre,
        ref,
        fecha,
        hora,
        incidencia
    };

    let lista = JSON.parse(localStorage.getItem("incidencias")) || [];
    lista.push(nueva);
    localStorage.setItem("incidencias", JSON.stringify(lista));

    crearFila(nueva);

    total++;
    pendientes++;
    actualizarContador();

    alert("Incidencia añadida");

    formulario.reset();
});

function crearFila(i) {
    let fila = document.createElement("tr");

    fila.innerHTML = `
        <td>${i.numero}</td>
        <td>${i.nombre}</td>
        <td>${i.ref}</td>
        <td>${i.fecha}</td>
        <td>${i.hora}</td>
        <td>${i.incidencia}</td>
        <td class="estado estado-pendiente">🟡 Pendiente</td>
        <td>
            <button onclick="resolver(this)">✔</button>
            <button onclick="eliminar(this)">🗑️</button>
        </td>
    `;

    tabla.appendChild(fila);
}


function resolver(boton) {
    let fila = boton.parentElement.parentElement;
    let estado = fila.querySelector(".estado");

    if (estado.classList.contains("estado-pendiente")) {

        estado.className = "estado estado-entregado";
        estado.textContent = "✔ Entregado";

        pendientes--;
        entregados++;

    } else if (estado.classList.contains("estado-entregado")) {

        estado.className = "estado estado-no";
        estado.textContent = "❌ No entregado";

        entregados--;
        noEntregados++;

    } else {

        estado.className = "estado estado-pendiente";
        estado.textContent = "🟡 Pendiente";

        noEntregados--;
        pendientes++;
    }

    actualizarContador();
}


function eliminar(boton) {
    let fila = boton.parentElement.parentElement;
    let numero = fila.children[0].textContent;

    if (confirm("¿Seguro que quieres eliminar esta incidencia?")) {

        let lista = JSON.parse(localStorage.getItem("incidencias")) || [];
        lista = lista.filter(i => i.numero !== numero);
        localStorage.setItem("incidencias", JSON.stringify(lista));

        fila.remove();

        total--;

        actualizarContador();

    }
}

function actualizarContador() {
    document.getElementById("contadorTotal").textContent = "Total: " + total;
    document.getElementById("contadorPendientes").textContent = "Pendientes: " + pendientes;
    document.getElementById("contadorEntregados").textContent = "Entregados: " + entregados;
    document.getElementById("contadorNo").textContent = "No entregados: " + noEntregados;
}
