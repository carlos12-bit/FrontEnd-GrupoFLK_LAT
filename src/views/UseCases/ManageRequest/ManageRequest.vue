<template>
  <navbar></navbar>
  <h1 class="page-title">Gestión de Solicitudes de Capacitación</h1>
  <div class="card-group" id="solicitud-cards"></div>
</template>

<script>
import navbar from '@/components/Website/Navbar.vue';
import { supabase } from '@/supabase.js';

export default {
  name: "GestionarSolicitudes",
  components: { navbar },
  async mounted() {
    let { data: solicitudes, error } = await supabase
      .from('Solicitud_Capacitacion')
      .select('*');

    if (error) {
      console.error("Error fetching data: ", error);
    } else {
      this.renderCards(solicitudes); // Llama a la función para renderizar las tarjetas
    }
  },
  methods: {
    renderCards(solicitudes) {
      const cardContainer = document.getElementById('solicitud-cards');
      solicitudes.forEach((solicitud) => {
        const card = `
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">${solicitud.nombre_completo || 'Nombre no disponible'}</h5>
              <p class="card-text">DNI: ${solicitud.dni || 'DNI no disponible'}</p>
              <p class="card-text">Fecha de Solicitud: ${solicitud.fecha_solicitud ? new Date(solicitud.fecha_solicitud).toLocaleDateString() : 'Fecha no disponible'}</p>
              <p class="card-text">Curso Solicitado: ${solicitud.curso_solicitado || 'Curso no disponible'}</p>
              <button class="card-btn" onclick="gestionarSolicitud(${solicitud.id_solicitud}, 'aceptar')">Aceptar</button>
              <button class="card-btn card-btn-rechazar" onclick="gestionarSolicitud(${solicitud.id_solicitud}, 'rechazar')">Rechazar</button>
              <button class="card-btn card-btn-detalles" onclick="verDetalles(${solicitud.id_solicitud})">Ver Detalles</button>
            </div>
          </div>
        `;
        cardContainer.innerHTML += card;
      });
    }
  }
};

function gestionarSolicitud(idSolicitud, accion) {
  if (accion === 'aceptar') {
    alert(`Solicitud con ID ${idSolicitud} aceptada`);
    // Aquí agregar lógica para aceptar la solicitud en la base de datos.
  } else if (accion === 'rechazar') {
    alert(`Solicitud con ID ${idSolicitud} rechazada`);
    // Aquí agregar lógica para rechazar la solicitud en la base de datos.
  }
}

function verDetalles(idSolicitud) {
  alert(`Ver detalles de la solicitud con ID ${idSolicitud}`);
  // Aquí agregar lógica para mostrar más detalles sobre la solicitud.
}
</script>

<style>
/* Contenedor general */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f4f4f9;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* Título */
.page-title {
  text-align: center;
  font-size: 2.5rem;
  color: #1A5276;
  margin-bottom: 2rem;
  font-weight: bold;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
}

/* Diseño del grupo de tarjetas */
.card-group {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 2rem;
}

/* Tarjeta individual */
.card {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 10px;
  width: 250px;
  transition: transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  overflow: hidden;
}

.card:hover {
  transform: translateY(-10px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

/* Cuerpo de la tarjeta */
.card-body {
  padding: 1.5rem;
  text-align: center;
}

/* Título de la tarjeta */
.card-title {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 0.5rem;
}

/* Texto de la tarjeta */
.card-text {
  font-size: 1rem;
  color: #555;
}

/* Botones de la tarjeta */
.card-btn {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #1A5276;
  color: white;
  border-radius: 5px;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.card-btn:hover {
  background-color: #2980B9;
}

.card-btn-rechazar {
  background-color: #C0392B;
}

.card-btn-rechazar:hover {
  background-color: #E74C3C;
}

.card-btn-detalles {
  background-color: #17A589;
}

.card-btn-detalles:hover {
  background-color: #1ABC9C;
}
</style>
