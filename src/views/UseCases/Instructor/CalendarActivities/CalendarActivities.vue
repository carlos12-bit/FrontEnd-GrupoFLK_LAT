<template>
  <div class="sessions-container">
    <h2>Sesiones Programadas</h2>
    <button class="add-session-button" @click="goToProgramarSesion">Programar Nueva Sesión</button>

    <div class="sessions-slider-container">
      <div class="arrow left-arrow" @click="prevCard">&#x25C0;</div>
      <div class="sessions-slider" ref="slider">
        <div v-for="(sesion, index) in sesiones" :key="sesion.pk_sesion" class="session-card">
          <h3>{{ sesion.titulo_curso }}</h3>
          <p><strong>Fecha:</strong> {{ sesion.fecha_session }}</p>
          <p><strong>Hora:</strong> {{ sesion.hora_inicio }} - {{ sesion.hora_fin }}</p>
          <p><strong>Modo:</strong> {{ sesion.nombre_modo }}</p>
          <p><strong>Docente Teoría:</strong> {{ sesion.docente_teoria }}</p>
          <p><strong>Docente Práctica:</strong> {{ sesion.docente_practica }}</p>
        </div>
      </div>
      <div class="arrow right-arrow" @click="nextCard">&#x25B6;</div>
    </div>

    <div class="calendar-container">
      <h2>Agenda de Sesiones</h2>
      <div id="calendar" ref="calendar"></div>
    </div>

    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="showModal = false">&times;</span>
        <h3>Detalles de la Sesión</h3>
        <p><strong>ID:</strong> {{ selectedSession.pk_sesion }}</p>
        <p><strong>Título:</strong> {{ selectedSession.titulo_curso }}</p>
        <p><strong>Fecha:</strong> {{ selectedSession.fecha_session }}</p>
        <p><strong>Hora:</strong> {{ selectedSession.hora_inicio }} - {{ selectedSession.hora_fin }}</p>
        <p><strong>Modo:</strong> {{ selectedSession.nombre_modo }}</p>
        <p><strong>Docente Teoría:</strong> {{ selectedSession.docente_teoria }}</p>
        <p><strong>Docente Práctica:</strong> {{ selectedSession.docente_practica }}</p>
        <p>
          <strong>Dirección Virtual:</strong>
          <a :href="selectedSession.direccion_session_virtual" target="_blank">
            {{ selectedSession.direccion_session_virtual }}
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { supabase } from "@/supabase";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

export default {
  name: "SessionsList",
  setup() {
    const sesiones = ref([]);
    const slider = ref(null);
    const calendarEvents = ref([]);
    const showModal = ref(false);
    const selectedSession = ref({});
    const userEmail = ref("");

    const fetchSesiones = async () => {
      try {
        // Obtener el correo del usuario autenticado
        const { data: { session }, error: authError } = await supabase.auth.getSession();

        if (authError || !session) {
          throw new Error("Usuario no autenticado");
        }

        userEmail.value = session.user.email;

        // Filtrar sesiones solo para el formador actual
        const { data, error } = await supabase
          .from("sesiones_programadas")
          .select(
            `pk_sesion, fecha_session, hora_inicio, hora_fin, direccion_session_virtual,
             curso:fk_curso (
              titulo_curso,
              docente_teoria:fk_docenteteoria (nombre, correo),
              docente_practica:fk_docentepractico (nombre)
            ),
            modo:fk_modo_curso (nombre_modo)`
          )
          .eq("curso.docente_teoria.correo", userEmail.value); // Filtrar por correo del formador

        if (error) throw error;

        sesiones.value = data.map((sesion) => ({
          pk_sesion: sesion.pk_sesion,
          titulo_curso: sesion.curso.titulo_curso,
          fecha_session: sesion.fecha_session,
          hora_inicio: sesion.hora_inicio,
          hora_fin: sesion.hora_fin,
          direccion_session_virtual: sesion.direccion_session_virtual,
          nombre_modo: sesion.modo.nombre_modo,
          docente_teoria: sesion.curso.docente_teoria?.nombre || "N/A",
          docente_practica: sesion.curso.docente_practica?.nombre || "N/A",
        }));

        // Convertir sesiones a eventos para el calendario
        calendarEvents.value = sesiones.value.map((sesion) => ({
          title: sesion.titulo_curso,
          start: `${sesion.fecha_session}T${sesion.hora_inicio}`,
          end: `${sesion.fecha_session}T${sesion.hora_fin}`,
          extendedProps: { ...sesion },
        }));
      } catch (error) {
        console.error("Error al obtener sesiones programadas:", error.message);
      }
    };

    const initializeCalendar = () => {
      const calendarEl = document.getElementById("calendar");
      const calendar = new Calendar(calendarEl, {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        initialView: "dayGridMonth",
        headerToolbar: {
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        },
        events: calendarEvents.value,
        eventClick: (info) => {
          selectedSession.value = info.event.extendedProps;
          showModal.value = true;
        },
      });

      calendar.render();
    };

    const nextCard = () => {
      if (slider.value) {
        slider.value.scrollBy({
          left: 300,
          behavior: "smooth",
        });
      }
    };

    const prevCard = () => {
      if (slider.value) {
        slider.value.scrollBy({
          left: -300,
          behavior: "smooth",
        });
      }
    };

    const goToProgramarSesion = async () => {
      // Aquí podrías redirigir a una vista específica o filtrar las tareas programadas
      window.location.href = "\ProgrammerSession";
    };

    onMounted(async () => {
      await fetchSesiones();
      initializeCalendar();
    });

    return {
      sesiones,
      slider,
      nextCard,
      prevCard,
      goToProgramarSesion,
      showModal,
      selectedSession,
      userEmail,
    };
  },
};
</script>



<style scoped>
.sessions-container {
  max-width: 2000px;
  margin: 0 auto;
  justify-content: center;
  /* Centra el carrusel horizontalmente */
  padding: 05px;
  text-align: center;
}

h2 {
  color: #0a0a0a;
  margin-bottom: 10px;
  font-size: 23px;
}
.calendar-container{
  background-color: #f5f7f8;
}
.add-session-button {
  position: relative;
  bottom: 30px;
  right: 500px;
  background-color: #95edf0;
  color: rgb(12, 12, 12);
  border: none;
  padding: 13px 20px;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.add-session-button:hover {
  background-color: #459aa0;
}

.sessions-slider-container {
  display: flex;
  align-items: center;
  justify-content: center;
  /* Centra el carrusel horizontalmente */
  gap: 10px;
  position: relative;

}

.sessions-slider {
  display: flex;
  overflow-x: hidden;
  /* Oculta la barra de desplazamiento */
  scroll-behavior: smooth;
  width: 100%;
  /* Asegúrate de que se adapte al tamaño */
  gap: 20px;
  padding: 10px;
}

.session-card {
  flex: 0 0 200px;
  /* Cambia el ancho de cada tarjeta */
  background-color: #e8f72086;
  padding: 15px;
  /* Reduce el padding */
  border-radius: 8px;
  /* Ajusta el radio de las esquinas */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  /* Reduce la sombra */
  text-align: left;
  transition: transform 0.3s ease-in-out;
}

.session-card h3 {
  font-size: 16px;
  /* Reduce el tamaño del título */
  color: #333;
  /* Cambia el color si es necesario */
  margin-bottom: 8px;
}

.session-card p {
  font-size: 14px;
  /* Reduce el tamaño del texto */
  margin: 4px 0;
  /* Ajusta los márgenes entre párrafos */
}

.session-card a {
  font-size: 13px;
  /* Reduce el tamaño del enlace */
}

.sessions-slider {
  display: flex;
  overflow-x: hidden;
  /* Oculta la barra de desplazamiento */
  scroll-behavior: smooth;
  width: 90%;
  /* Ajusta el ancho del carrusel */
  gap: 15px;
  /* Reduce el espacio entre tarjetas */
  padding: 10px;
}

.arrow {
  width: 50px;
  /* Tamaño de la flecha */
  height: 50px;
  background-image: url('\flecha-carrusel.png');
  /* Ruta de tu imagen */
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  border: none;
  /* Sin bordes */
  cursor: pointer;
  transition: transform 0.2s ease;
}

.arrow:hover {
  transform: scale(1.1);
  /* Efecto de agrandar al pasar el mouse */
}

a {
  color: #0f79eb;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.header {
  background-color: #f5f5f5;
  text-align: center;
  font-weight: bold;
  border: 1px solid #ccc;
}

.hour {
  grid-column: 1;
  text-align: center;
  background-color: #fff;
  border: 1px solid #ccc;
  font-size: 12px;
}

.cell {
  border: 1px solid #eee;
  background-color: #fff;
}

.session-block {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 5px;
  line-height: 1.2;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 20px;
  width: 80%;
  max-width: 500px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>
