<template>
  <div class="container">
    <h1 class="page-title">Gestión de Solicitudes de Capacitación</h1>

    <!-- Tabla de solicitudes generales -->
    <h2 class="table-title">Solicitudes Generales</h2>
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
          <th>Nombre del Curso</th>
          <th>Fecha de Solicitud</th>
          <th>Estado</th>
          <th>Opciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="solicitud in solicitudesPaginadas" :key="solicitud.id_solicitud">
          <td>{{ solicitud.id_solicitud }}</td>
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

    <!-- Paginación (nueva) -->
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
      <button @click="irPaginaSiguiente" :disabled="paginaActual === numeroPaginas">
        Siguiente
      </button>
      <button @click="irUltimaPagina" :disabled="paginaActual === numeroPaginas">Último</button>
    </div>

    <!-- Modal de rechazo -->
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

    <!-- Segunda tabla: Carrusel de solicitudes aceptadas -->
    <h2 class="table-title">Solicitudes Aceptadas</h2>
    <div class="search-container">
      <input
        type="text"
        v-model="searchId"
        placeholder="Buscar por ID de Solicitud"
        class="search-input"
      />
    </div>
    <div class="dashboard-aceptadas">
      <div class="carousel">
        <button @click="prevCard" class="carousel-button left">‹</button>
        <div class="aceptadas-grid" ref="aceptadasGrid">
          <div
            v-for="solicitud in solicitudesAceptadasFiltradas"
            :key="solicitud.id_solicitud"
            class="aceptada-card"
            @click="abrirModalDetalles(solicitud)"
          >
            <h3>ID: {{ solicitud.id_solicitud }}</h3>
            <h4>{{ getNombreCurso(solicitud.fk_curso) || "Sin curso" }}</h4>
            <p><strong>Fecha de Solicitud:</strong> {{ formatFecha(solicitud.fecha_solicitud) }}</p>
            <p><strong>Solicitante:</strong> {{ solicitud.nombre_completo }}</p>
          </div>
        </div>
        <button @click="nextCard" class="carousel-button right">›</button>
      </div>
    </div>

    <!-- Modal de detalles (Segunda Tabla) -->
    <div v-if="mostrarModalDetalles" class="modal-overlay">
  <div class="modal-content">
    <h3>Detalles de la Solicitud</h3>
    <div class="modal-details">
      <div class="detail-item">
        <div class="detail-title">ID Solicitud:</div>
        <div class="detail-value">{{ solicitudActual.id_solicitud }}</div>
      </div>
      <div class="detail-item">
        <div class="detail-title">DNI:</div>
        <div class="detail-value">{{ solicitudActual.dni }}</div>
      </div>
      <div class="detail-item">
        <div class="detail-title">Nombre Completo:</div>
        <div class="detail-value">{{ solicitudActual.nombre_completo }}</div>
      </div>
      <div class="detail-item">
        <div class="detail-title">Número Telefónico:</div>
        <div class="detail-value">{{ solicitudActual.nro_telefonico }}</div>
      </div>
      <div class="detail-item">
        <div class="detail-title">Dirección:</div>
        <div class="detail-value">{{ solicitudActual.direccion }}</div>
      </div>
      <div class="detail-item">
        <div class="detail-title">Teléfono de Contacto:</div>
        <div class="detail-value">{{ solicitudActual.telefono_contacto }}</div>
      </div>
      <div class="detail-item">
        <div class="detail-title">Correo Electrónico:</div>
        <div class="detail-value">{{ solicitudActual.correo_electronico }}</div>
      </div>
      <div class="detail-item">
        <div class="detail-title">Nacionalidad:</div>
        <div class="detail-value">{{ solicitudActual.nacionalidad }}</div>
      </div>
      <div class="detail-item">
        <div class="detail-title">Curso Solicitado:</div>
        <div class="detail-value">{{ getNombreCurso(solicitudActual.fk_curso) }}</div>
      </div>
      <div class="detail-item">
        <div class="detail-title">Nombre de la Empresa:</div>
        <div class="detail-value">{{ solicitudActual.nombre_empresa }}</div>
      </div>
      <div class="detail-item">
        <div class="detail-title">Cargo Actual:</div>
        <div class="detail-value">{{ solicitudActual.cargo_actual }}</div>
      </div>
      <div class="detail-item">
        <div class="detail-title">Experiencia en Maquinaria:</div>
        <div class="detail-value">{{ solicitudActual.experiencia_maquinaria }}</div>
      </div>
    </div>

    <!-- Botón para cerrar el modal -->
    <div class="modal-buttons">
      <button @click="cerrarModalDetalles" class="btn-cerrar-modal">Cerrar</button>
    </div>
  </div>
</div>

  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { supabase } from "@/supabase.js";
import { useRouter } from "vue-router";

export default {
  setup() {
    // Variables reactivas
    const solicitudes = ref([]);
    const cursos = ref([]);
    const registrosPorPagina = ref(5);
    const paginaActual = ref(1);
    const searchQuery = ref("");
    const searchId = ref("");
    const mostrarModalRechazo = ref(false);
    const mostrarModalDetalles = ref(false);
    const motivoRechazo = ref("");
    const solicitudActual = ref(null);
    const router = useRouter();

    // Funciones para cargar datos
    const fetchSolicitudes = async () => {
      const { data, error } = await supabase.from("solicitud_capacitacion").select("*");
      if (!error) solicitudes.value = data.sort((a, b) =>
        new Date(b.fecha_solicitud) - new Date(a.fecha_solicitud)
      );
    };

    const fetchCursos = async () => {
      const { data, error } = await supabase.from("cursos").select("*");
      if (!error) cursos.value = data;
    };

    // Computed: Filtrar y paginar solicitudes
    const solicitudesFiltradas = computed(() => {
  return solicitudes.value
    .filter(
      (solicitud) =>
        !searchQuery.value ||
        (getNombreCurso(solicitud.fk_curso) || "").toLowerCase().includes(searchQuery.value.toLowerCase())
    )
    .sort((a, b) => a.id_solicitud - b.id_solicitud); // Ordenar por ID
});

    const solicitudesPaginadas = computed(() => {
      const inicio = (paginaActual.value - 1) * registrosPorPagina.value;
      return solicitudesFiltradas.value.slice(inicio, inicio + registrosPorPagina.value);
    });

    // Nueva propiedad computada: Filtrar solicitudes aceptadas
    const solicitudesAceptadasFiltradas = computed(() => {
  return solicitudes.value
    .filter(
      (solicitud) =>
        solicitud.estado === "Aceptada" &&
        (!searchId.value || solicitud.id_solicitud.toString().includes(searchId.value))
    )
    .sort((a, b) => a.id_solicitud - b.id_solicitud); // Ordenar por ID
});

    // Computed: Número total de páginas
    const numeroPaginas = computed(() => {
      return Math.ceil(solicitudesFiltradas.value.length / registrosPorPagina.value);
    });

    // Funciones de paginación
    const irPrimeraPagina = () => {
      paginaActual.value = 1;
    };

    const irUltimaPagina = () => {
      paginaActual.value = numeroPaginas.value;
    };

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

    // Funciones para gestionar solicitudes
    const gestionarSolicitud = async (solicitud, estado) => {
      try {
        const nuevoEstado = estado === "aceptado" ? "Aceptada" : "Rechazada";
        const { error } = await supabase
          .from("solicitud_capacitacion")
          .update({ estado: nuevoEstado, motivo_rechazo: estado === "rechazado" ? motivoRechazo.value : null })
          .eq("id_solicitud", solicitud.id_solicitud);

        if (error) throw error;

        alert(`Solicitud ${nuevoEstado}`);
        fetchSolicitudes();
      } catch (error) {
        console.error(`Error al ${estado} la solicitud:`, error);
      }
    };

    // Modal de rechazo
    const abrirModalRechazo = (solicitud) => {
      solicitudActual.value = solicitud;
      mostrarModalRechazo.value = true;
    };

    const cerrarModalRechazo = () => {
      mostrarModalRechazo.value = false;
      motivoRechazo.value = "";
    };

    const confirmarRechazo = async () => {
      await gestionarSolicitud(solicitudActual.value, "rechazado");
      cerrarModalRechazo();
    };

    // Modal de detalles
    const abrirModalDetalles = (solicitud) => {
      solicitudActual.value = solicitud;
      mostrarModalDetalles.value = true;
    };

    const cerrarModalDetalles = () => {
      mostrarModalDetalles.value = false;
    };

    // Funciones del carrusel (segunda tabla)
    const prevCard = () => {
      const grid = document.querySelector(".aceptadas-grid");
      grid.scrollBy({ left: -220, behavior: "smooth" });
    };

    const nextCard = () => {
      const grid = document.querySelector(".aceptadas-grid");
      grid.scrollBy({ left: 220, behavior: "smooth" });
    };

    // Utilidades
    const formatFecha = (fecha) => {
      if (!fecha) return "Fecha no disponible";
      const date = new Date(fecha);
      return date.toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });
    };

    const getNombreCurso = (fk_curso) => {
      const curso = cursos.value.find((c) => c.pk_curso === fk_curso);
      return curso ? curso.titulo_curso : "Curso no encontrado";
    };

    const viewSolicitud = (solicitud) => {
      router.push({ path: "ManageRequest/Details", query: { id: solicitud.id_solicitud } });
    };

    // Inicialización
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
      solicitudesAceptadasFiltradas, // Nueva propiedad computada
      numeroPaginas,
      irPrimeraPagina,
      irUltimaPagina,
      irPaginaAnterior,
      irPaginaSiguiente,
      validarPagina,
      searchQuery,
      searchId,
      gestionarSolicitud,
      abrirModalRechazo,
      cerrarModalRechazo,
      confirmarRechazo,
      abrirModalDetalles,
      cerrarModalDetalles,
      prevCard,
      nextCard,
      formatFecha,
      getNombreCurso,
      viewSolicitud,
      mostrarModalRechazo,
      mostrarModalDetalles,
      motivoRechazo,
      solicitudActual,
    };
  },
};
</script>


<style scoped>
/* Contenedor principal */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f4f4f9;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* Títulos */
.page-title {
  font-size: 1.8rem; /* Ajuste del tamaño del título principal */
  color: #333;
  text-align: center;
  margin-bottom: 1rem;
  font-weight: bold;
}

.table-title {
  font-size: 1.4rem; /* Ajuste del tamaño del título de las tablas */
  color: #333;
  margin-bottom: 1rem;
  font-weight: bold;
}

/* Tabla */
.solicitudes-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

.solicitudes-table th,
.solicitudes-table td {
  border: 1px solid #ccc;
  padding: 0.75rem;
  text-align: left;
}

.solicitudes-table th {
  background-color: #f4f4f4;
  font-weight: bold;
  font-size: 1.2rem;
  color: #333;
}

.solicitudes-table td {
  font-size: 1rem;
}

/* Botones de acciones en la tabla */
.view-btn {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.view-btn:hover {
  background-color: #2980b9;
}

/* Controles de búsqueda y paginación */
.controls-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination-controls label {
  font-size: 1rem;
  color: #333;
}

.pagination-controls select {
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.search-container {
  display: flex;
  align-items: center;
}

.search-input {
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1rem;
  width: 300px;
}

/* Paginación */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.pagination button {
  padding: 0.5rem 1rem;
  background-color: #3498db;
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
  background-color: #2980b9;
}

/* Carrusel de solicitudes aceptadas */
.dashboard-aceptadas {
  margin-top: 2rem;
}

.carousel {
  display: flex;
  align-items: center;
}

.aceptadas-grid {
  display: flex;
  overflow-x: hidden;
  scroll-behavior: smooth;
  padding: 1rem;
}

.aceptada-card {
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  min-width: 200px;
  max-width: 200px;
  text-align: center;
  margin: 0 0.5rem;
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.1s ease, background-color 0.2s ease;
}

.aceptada-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  background-color: #f0f8ff;
}

/* Botones de navegación del carrusel */
.carousel-button {
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  padding: 0.5rem 1rem;
  margin: 0 0.5rem;
  font-size: 1.2rem;
}

.carousel-button:hover {
  background-color: #2980b9;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease-in-out;
}

.modal-content {
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  max-width: 700px;
  width: 90%;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
  max-height: 90vh;
  padding: 2rem 3rem;
  animation: slideDown 0.3s ease-in-out;
}

.modal-content h3 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
}

.modal-content p {
  font-size: 1rem;
  margin: 0.5rem 0;
}

.modal-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.btn-cerrar-modal {
  background-color: #e74c3c;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-cerrar-modal:hover {
  background-color: #c0392b;
}

/* Animaciones */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideDown {
  from {
    transform: translateY(-20px);
  }
  to {
    transform: translateY(0);
  }
}
/* Modal de detalles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease-in-out;
}

.modal-content {
  background: #fff;
  padding: 2rem;
  border-radius: 15px;
  max-width: 900px;
  width: 90%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
  max-height: 90vh;
  animation: slideDown 0.3s ease-in-out;
}

.modal-content h3 {
  font-size: 1.8rem;
  color: #333;
  text-align: center;
  margin-bottom: 1.5rem;
  font-weight: bold;
}

/* Estilo de los detalles en formato tabla */
.modal-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.modal-details div {
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-details div:nth-child(odd) {
  background-color: #f9f9f9;
}

.modal-details strong {
  color: #4a90e2;
  font-size: 1rem;
  font-weight: bold;
}

.modal-details span {
  color: #333;
  font-size: 1rem;
  text-align: right;
  word-break: break-word;
}

/* Botones */
.modal-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-cerrar-modal {
  background-color: #e74c3c;
  color: white;
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-cerrar-modal:hover {
  background-color: #c0392b;
}

/* Animaciones */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideDown {
  from {
    transform: translateY(-20px);
  }
  to {
    transform: translateY(0);
  }
}
/* Modal de detalles */
.modal-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.modal-details .inline {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.modal-details .inline:nth-child(odd) {
  background-color: #ffffff;
}

.modal-details .inline strong {
  color: #4a90e2;
  font-size: 1rem;
  font-weight: bold;
  text-align: left;
}

.modal-details .inline span {
  color: #333;
  font-size: 1rem;
  text-align: left;
  word-break: break-word;
}

/* Botones */
.modal-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-cerrar-modal {
  background-color: #e74c3c;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-cerrar-modal:hover {
  background-color: #c0392b;
}


</style>
