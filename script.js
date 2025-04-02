// Inicializar Email.js con tu User ID
emailjs.init("Z_ph_ohHTViGK6jAa"); // Reemplaza con tu User ID de Email.js

document.addEventListener('DOMContentLoaded', function() {
    cargarPrendas();
});

// Obtener y mostrar prendas
function cargarPrendas() {
    fetch('http://localhost:3000/prendas')
        .then(response => response.json())
        .then(data => {
            const tablaPrendas = document.getElementById('tabla-prendas');
            tablaPrendas.innerHTML = ''; // Limpiar tabla antes de cargar
            data.forEach(prenda => {
                agregarFila(prenda);
            });
        })
        .catch(error => console.error('Error:', error));
}

// Agregar nueva prenda
const formulario = document.getElementById('form-agregar-prenda');
formulario.removeEventListener('submit', agregarPrenda); // Eliminamos si ya estaba
formulario.addEventListener('submit', agregarPrenda); // Lo agregamos solo una vez

function agregarPrenda(event) {
    event.preventDefault();

    const prendaData = {
        numero: document.getElementById('numero').value,
        prenda: document.getElementById('prenda').value,
        estado: document.getElementById('estado').value,
        cliente: document.getElementById('cliente').value,
        precio: document.getElementById('precio').value
    };

    fetch('http://localhost:3000/agregar-prenda', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prendaData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Respuesta del servidor:', data);
        agregarFila(data);
        document.getElementById('form-agregar-prenda').reset();
    })
    .catch(error => console.error('Error:', error));
}

// Función para agregar una fila a la tabla
function agregarFila(prenda) {
    console.log("Agregando fila a la tabla:", prenda);
    const tablaPrendas = document.getElementById('tabla-prendas');
    const nuevaFila = document.createElement('tr');
    nuevaFila.innerHTML = `
        <td>${prenda.numero}</td>
        <td>${prenda.prenda}</td>
        <td class="${prenda.estado === 'Completado' ? 'estado-completado' : 'estado-en-proceso'}">${prenda.estado}</td>
        <td>${prenda.cliente}</td>
        <td>$${prenda.precio}</td>
        <td>
            <button class="btn btn-danger btn-sm" onclick="eliminarPrenda(${prenda.id}, this)">Eliminar</button>
        </td>
    `;
    tablaPrendas.appendChild(nuevaFila);
}

// Eliminar prenda
function eliminarPrenda(id, boton) {
    fetch(`http://localhost:3000/eliminar-prenda/${id}`, { method: 'DELETE' })
    .then(response => response.json())
    .then(() => {
        boton.closest('tr').remove();
    })
    .catch(error => console.error('Error:', error));
}

// 🔹 Enviar formulario de contacto con Email.js
document.addEventListener('DOMContentLoaded', function () {
    const formContacto = document.getElementById('form-contacto');

    if (formContacto) {
        formContacto.addEventListener('submit', function (event) {
            event.preventDefault();

            const nombre = document.getElementById('nombre').value;
            const correo = document.getElementById('correo').value;
            const telefono = document.getElementById('telefono').value;

            emailjs.send("service_0cc4ywn", "template_bjvw4tr", {
                nombre: nombre,
                correo: correo,
                telefono: telefono
            })
            .then(function (response) {
                console.log("Correo enviado con éxito:", response);
                alert("Mensaje enviado correctamente.");
                formContacto.reset();
            })
            .catch(function (error) {
                console.error("Error al enviar el correo:", error);
                alert("Hubo un error al enviar el mensaje. Inténtalo de nuevo.");
            });
        });
    } else {
        console.error("No se encontró el formulario de contacto en el DOM.");
    }
});
