<template>
  <div class="sessions-container">
    <h2>Sesiones Programadas</h2>
    <button class="add-session-button" @click="goToProgramarSesion">Programar Nueva Sesión</button>

    <!-- Contenedor del Carrusel -->
    <div class="sessions-slider-container">
      <!-- Flecha Izquierda -->
      <div class="arrow left-arrow" @click="prevCard">
        &#x25C0;
      </div>

      <!-- Carrusel con deslizamiento -->
      <div class="sessions-slider" ref="slider">
        <div v-for="(sesion, index) in sesiones" :key="sesion.pk_sesion" class="session-card">
          <h3>{{ sesion.titulo_curso }}</h3>
          <p><strong>Fecha:</strong> {{ sesion.fecha_session }}</p>
          <p><strong>Hora:</strong> {{ sesion.hora_inicio }} - {{ sesion.hora_fin }}</p>
          <p><strong>Modo:</strong> {{ sesion.nombre_modo }}</p>
          <p><strong>Docente Teoría:</strong> {{ sesion.docente_teoria }}</p>
          <p><strong>Docente Práctica:</strong> {{ sesion.docente_practica }}</p>
          <p>
            <strong>Dirección Virtual:</strong>
            <a :href="sesion.direccion_session_virtual" target="_blank">
              {{ sesion.direccion_session_virtual }}
            </a>
          </p>
        </div>
      </div>

      <!-- Flecha Derecha -->
      <div class="arrow right-arrow" @click="nextCard">
        &#x25B6;
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { supabase } from "@/supabase";

export default {
  name: "SessionsList",
  setup() {
    const sesiones = ref([]);
    const slider = ref(null); // Referencia al contenedor deslizante

    const fetchSesiones = async () => {
      try {
        const { data, error } = await supabase
          .from("sesiones_programadas")
          .select(
            `
            pk_sesion,
            fecha_session,
            hora_inicio,
            hora_fin,
            direccion_session_virtual,
            curso:fk_curso (
              titulo_curso,
              docente_teoria:fk_docenteteoria (
                nombre
              ),
              docente_practica:fk_docentepractico (
                nombre
              )
            ),
            modo:fk_modo_curso (nombre_modo)
          `
          );

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
      } catch (error) {
        console.error("Error al obtener sesiones programadas:", error.message);
      }
    };

    const nextCard = () => {
      if (slider.value) {
        slider.value.scrollBy({
          left: 300, // Tamaño de desplazamiento
          behavior: "smooth", // Movimiento suave
        });
      }
    };

    const prevCard = () => {
      if (slider.value) {
        slider.value.scrollBy({
          left: -300, // Tamaño de desplazamiento hacia la izquierda
          behavior: "smooth",
        });
      }
    };

    const goToProgramarSesion = () => {
      window.location.href = "\ProgrammerSession";
    };

    onMounted(fetchSesiones);

    return {
      sesiones,
      slider,
      nextCard,
      prevCard,
      goToProgramarSesion,
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
  color: #2167ac;
  margin-bottom: 20px;
  font-size: 20px;
}

.add-session-button {
  position: absolute;
  /* Posición absoluta dentro del contenedor */
  top: 330px;
  /* Ajusta la posición vertical */
  right: 10px;
  /* Ajusta la posición horizontal */
  background-color: #4dac50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}

.add-session-button:hover {
  background-color: #45a049;
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
  background-color: #f1f1d1;
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
  color: #007bff;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
