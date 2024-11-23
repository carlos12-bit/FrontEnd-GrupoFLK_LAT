<template>
  <div class="container">
    <h1 class="page-title">Gestión de Solicitudes de Capacitación</h1>
    <div class="controls-container">
      <div class="pagination-controls">
        <label for="registrosPorPagina">Mostrar</label>
        <select v-model="registrosPorPagina" id="registrosPorPagina">
          <option v-for="num in [5, 10, 20]" :key="num" :value="num">{{ num }}</option>
        </select>
        <span>registros</span>
      </div>
      <div class="search-container">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Buscar por nombre del curso"
          class="search-input"
        />
      </div>
    </div>
    <table class="solicitudes-table">
      <thead>
        <tr>
          <th>ID Solicitud</th>
          <th>Nombre</th>
          <th>Curso</th>
          <th>Fecha de Solicitud</th>
          <th>Estado</th>
          <th>Opciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="solicitud in solicitudesPaginadas" :key="solicitud.id_solicitud">
          <td>{{ solicitud.id_solicitud }}</td>
          <td>{{ solicitud.nombre_solicitante }}</td>
          <td>{{ getNombreCurso(solicitud.fk_curso) }}</td>
          <td>{{ formatFecha(solicitud.fecha_solicitud) }}</td>
          <td>{{ solicitud.estado || "Sin asignar" }}</td>
          <td>
            <button @click="viewSolicitud(solicitud)" class="view-btn">Ver</button>
            <button @click="gestionarSolicitud(solicitud, 'aceptado')" class="view-btn">Aceptar</button>
            <button @click="abrirModalRechazo(solicitud)" class="view-btn">Rechazar</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="pagination">
      <span>
        Mostrando {{ (paginaActual - 1) * registrosPorPagina + 1 }} a
        {{ Math.min(paginaActual * registrosPorPagina, solicitudesFiltradas.length) }} de
        {{ solicitudesFiltradas.length }} registros
      </span>
      <button @click="irPrimeraPagina" :disabled="paginaActual === 1">Primero</button>
      <button @click="irPaginaAnterior" :disabled="paginaActual === 1">Anterior</button>
      <input
        type="number"
        v-model.number="paginaActual"
        min="1"
        :max="numeroPaginas"
        @change="validarPagina"
        class="pagina-input"
      />
      <button @click="irPaginaSiguiente" :disabled="paginaActual === numeroPaginas">Siguiente</button>
      <button @click="irUltimaPagina" :disabled="paginaActual === numeroPaginas">Último</button>
    </div>
    <div v-if="mostrarModalRechazo" class="modal-overlay">
      <div class="modal-content">
        <h3>Motivo de Rechazo</h3>
        <textarea v-model="motivoRechazo" placeholder="Ingrese el motivo del rechazo"></textarea>
        <div class="modal-buttons">
          <button @click="confirmarRechazo" class="btn-cerrar-modal">Confirmar</button>
          <button @click="cerrarModalRechazo" class="btn-cerrar-modal">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { supabase } from "@/supabase.js";

export default {
  setup() {
    const solicitudes = ref([]);
    const cursos = ref([]);
    const registrosPorPagina = ref(5);
    const paginaActual = ref(1);
    const searchQuery = ref("");
    const mostrarModalRechazo = ref(false);
    const motivoRechazo = ref("");
    const solicitudActual = ref(null);

    const fetchSolicitudes = async () => {
      try {
        const { data, error } = await supabase.from("solicitud_capacitacion").select("*");
        if (error) throw error;
        solicitudes.value = data; console.log(data)
      } catch (error) {
        console.error("Error al cargar las solicitudes:", error);
      }
    };

    const fetchCursos = async () => {
      const { data, error } = await supabase.from("cursos").select("*");
      if (error) throw error;
      cursos.value = data;
    };

    const solicitudesFiltradas = computed(() => {
      return solicitudes.value.filter(
        (solicitud) =>
          !searchQuery.value ||
          (getNombreCurso(solicitud.fk_curso) || "").toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    });

    const solicitudesPaginadas = computed(() => {
      const inicio = (paginaActual.value - 1) * registrosPorPagina.value;
      return solicitudesFiltradas.value.slice(inicio, inicio + registrosPorPagina.value);
    });

    const numeroPaginas = computed(() => {
      return Math.ceil(solicitudesFiltradas.value.length / registrosPorPagina.value);
    });

    const irPrimeraPagina = () => (paginaActual.value = 1);
    const irUltimaPagina = () => (paginaActual.value = numeroPaginas.value);
    const irPaginaAnterior = () => {
      if (paginaActual.value > 1) paginaActual.value--;
    };
    const irPaginaSiguiente = () => {
      if (paginaActual.value < numeroPaginas.value) paginaActual.value++;
    };
    const validarPagina = () => {
      if (paginaActual.value < 1) paginaActual.value = 1;
      if (paginaActual.value > numeroPaginas.value) paginaActual.value = numeroPaginas.value;
    };

    const abrirModalRechazo = (solicitud) => {
      solicitudActual.value = solicitud;
      mostrarModalRechazo.value = true;
    };

    const cerrarModalRechazo = () => {
      mostrarModalRechazo.value = false;
      motivoRechazo.value = "";
    };

    const confirmarRechazo = async () => {
      try {
        const { error } = await supabase
          .from("solicitud_capacitacion")
          .update({ estado: "Rechazada", motivo_rechazo: motivoRechazo.value })
          .eq("id_solicitud", solicitudActual.value.id_solicitud);
        if (error) throw error;
        fetchSolicitudes();
        cerrarModalRechazo();
      } catch (error) {
        console.error("Error al rechazar la solicitud:", error);
      }
    };

    const getNombreCurso = (fk_curso) => {
      const curso = cursos.value.find((curso) => curso.pk_curso === fk_curso);
      return curso ? curso.titulo_curso : "Curso no encontrado";
    };

    const formatFecha = (fecha) => {
      if (!fecha) return "Sin fecha";
      const date = new Date(fecha);
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    onMounted(() => {
      fetchSolicitudes();
      fetchCursos();
    });

    return {
      solicitudes,
      cursos,
      registrosPorPagina,
      paginaActual,
      solicitudesFiltradas,
      solicitudesPaginadas,
      numeroPaginas,
      searchQuery,
      mostrarModalRechazo,
      motivoRechazo,
      solicitudActual,
      irPrimeraPagina,
      irUltimaPagina,
      irPaginaAnterior,
      irPaginaSiguiente,
      validarPagina,
      abrirModalRechazo,
      cerrarModalRechazo,
      confirmarRechazo,
      getNombreCurso,
      formatFecha,
    };
  },
};
</script>

 


<style scoped>
/* Contenedor principal */
.container {
  max-width: 100%;
  margin: 0 auto;
  padding: 1.5rem;
  background-color: transparent; /* Fondo transparente */
  border-radius: 0; /* Eliminar bordes redondeados */
  box-shadow: none; /* Eliminar sombras */
}

/* Títulos */
.page-title,
.table-title {
  color: #0c0f18;
  text-align: center;
  font-weight: bold;
  margin-bottom: 1rem;
}

.page-title {
  font-size: 2rem;
}

.table-title {
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
}

/* Tabla */
.solicitudes-table {
  width: 100%;
  border-collapse: collapse;
  background-color: transparent; /* Fondo transparente */
  color: #080b13; /* Texto acorde al diseño */
}

.solicitudes-table th {
  background-color: rgba(112, 149, 210, 0.6); /* Fondo semitransparente */
  color: rgb(19, 7, 7);
  padding: 0.75rem;
  font-size: 1rem;
}

.solicitudes-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid rgba(26, 37, 54, 0.4); /* Bordes suaves */
  background-color: transparent; /* Sin fondo */
}

/* Botones */
.view-btn {
  color: rgb(1, 0, 0);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.view-btn:hover {
  background-color: #8aa8bb; /* Azul más oscuro */
  transform: scale(1.05);
}

.pagination button {
  padding: 0.5rem 1rem;
  background-color: #4a5c93;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.pagination button:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.pagination button:hover:enabled {
  background-color: #090b11;
}

/* Controles de búsqueda y paginación */
.controls-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.pagination-controls label,
.pagination-controls select,
.search-input {
  font-size: 1rem;
  color: #4a5c93;
}

.search-input {
  border: 1px solid rgba(64, 121, 211, 0.4);
  border-radius: 5px;
  padding: 0.5rem;
  background-color: rgba(255, 255, 255, 0.8); /* Fondo semitransparente */
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1); /* Apariencia de relieve */
}

/* Carrusel de solicitudes aceptadas */
.dashboard-aceptadas {
  margin-top: 2rem;
}

.aceptada-card {
  background-color: rgba(247, 246, 246, 0.6);
  border: 1px solid rgba(43, 114, 227, 0.4);
  color: #4a5c93;
  text-align: center;
  border-radius: 10px;
  box-shadow: none; /* Sin sombras */
}

.aceptada-card:hover {
  background-color: rgba(112, 149, 210, 0.2);
  transform: scale(1.02);
  transition: transform 0.2s, background-color 0.3s;
}
</style>