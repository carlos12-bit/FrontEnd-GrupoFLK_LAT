<template>
  <div class="container">
    <h1 class="page-title">Gestión de Solicitudes de Capacitación</h1>

    <!-- Tabla de solicitudes generales -->
  
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
          <th>Nombre del Solicitante</th>
          <th>Nombre del Curso</th>
          <th>Fecha de Solicitud</th>
          <th>Estado</th>
          <th>Opciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="solicitud in solicitudesPaginadas" :key="solicitud.id_solicitud">
          <td>{{ solicitud.id_solicitud }}</td>
          <td>{{ solicitud.nombre_completo }}</td>
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
  try {
    const { data, error } = await supabase.from("solicitud_capacitacion").select("*");
    if (error) throw error;

    console.log("Solicitudes cargadas:", data); // Verificar los datos obtenidos en consola
    solicitudes.value = data.sort((a, b) => new Date(b.fecha_solicitud) - new Date(a.fecha_solicitud));
  } catch (error) {
    console.error("Error al cargar las solicitudes:", error.message);
  }
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

    const gestionarSolicitud = async (solicitud, estado) => {
      try {
        const nuevoEstado = estado === "aceptado" ? "Aceptada" : "Rechazada";
        const { error } = await supabase
          .from("solicitud_capacitacion")
          .update({ estado: nuevoEstado, motivo_rechazo: estado === "rechazado" ? motivoRechazo.value : null })
          .eq("id_solicitud", solicitud.id_solicitud);

        if (error) throw error;

        // Enviar correo tras actualizar el estado
        await enviarCorreo(solicitud, estado);

        alert(`Solicitud ${nuevoEstado}`);
        fetchSolicitudes();
      } catch (error) {
        console.error(`Error al ${estado} la solicitud:`, error);
      }
    };

    const confirmarRechazo = async () => {
      await gestionarSolicitud(solicitudActual.value, "rechazado");
      cerrarModalRechazo();
    };

    const abrirModalRechazo = (solicitud) => {
      solicitudActual.value = solicitud;
      mostrarModalRechazo.value = true;
    };

    const cerrarModalRechazo = () => {
      mostrarModalRechazo.value = false;
      motivoRechazo.value = "";
    };

    async function enviarCorreo(solicitud, estado) {
      try {
        // Configuración del asunto y cuerpo del correo
        const asunto = `Estado de tu solicitud: ${
          estado === "aceptado" ? "Aceptada" : "Rechazada"
        }`;
        const cuerpo = `
          <h2>Estado de tu solicitud</h2>
          <p>Hola,</p>
          <p>Tu solicitud para el curso <strong>${getNombreCurso(
            solicitud.fk_curso
          )}</strong> ha sido
          <strong>${estado === "aceptado" ? "Aceptada" : "Rechazada"}</strong>.</p>
          <p>${
            estado === "aceptado"
              ? "¡Felicitaciones! Tu solicitud ha sido aprobada."
              : motivoRechazo.value
          }</p>
          <p>Para confirmar esta acción, haz clic en el siguiente enlace:</p>
          <p><a href="https://tu-app.com/confirmacion?solicitud=${
            solicitud.id_solicitud
          }">Confirmar acción</a></p>
          <p>Gracias,</p>
          <p>Equipo de Gestión de Capacitación</p>
        `;

        // Llama a la función RPC en Supabase
        const { error } = await supabase.rpc("enviar_correo", {
          destinatario: solicitud.correo_electronico, // Correo del destinatario
          asunto: asunto, // Asunto del correo
          cuerpo: cuerpo, // Contenido del correo
        });

        if (error) throw error;

        alert("Correo enviado exitosamente");
      } catch (error) {
        console.error("Error al enviar el correo:", error);
        alert("Hubo un error al enviar el correo.");
      }
    }

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
  max-width: 100%;
  margin: 0 auto;
  padding: 1.5rem;
  background-color: #f9f9f9; /* Fondo claro */
  border-radius: 8px; /* Bordes redondeados */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Sombras suaves */
}

/* Títulos */
.page-title,
.table-title {
  color: #333333; /* Color de texto más suave */
  text-align: center;
  font-weight: bold;
  margin-bottom: 1rem;
}

.page-title {
  font-size: 2.2rem;
}

.table-title {
  font-size: 1.6rem;
  margin-bottom: 0.8rem;
}

/* Tabla */
.solicitudes-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #ffffff; /* Fondo blanco */
  color: #444444; /* Texto más suave */
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Sombras suaves */
}

.solicitudes-table th {
  background-color: #4a90e2; /* Fondo azul vibrante */
  color: #ffffff; /* Texto blanco */
  padding: 0.75rem;
  font-size: 1rem;
  text-align: left;
}

.solicitudes-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #eeeeee; /* Bordes suaves */
  background-color: #fdfdfd; /* Fondo claro */
}

.solicitudes-table tr:nth-child(even) td {
  background-color: #f7f9fc; /* Fondo alternado para filas pares */
}

.solicitudes-table tr:hover td {
  background-color: #eaf4ff; /* Resaltado en hover */
  transition: background-color 0.2s ease-in-out;
}

/* Botones */
.view-btn {
  background-color: #007bff; /* Azul principal */
  color: #ffffff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.view-btn:hover {
  background-color: #0056b3; /* Azul más oscuro */
  transform: scale(1.05);
}

.pagination button {
  padding: 0.5rem 1rem;
  background-color: #4a90e2; /* Azul vibrante */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.pagination button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.pagination button:hover:enabled {
  background-color: #0056b3; /* Azul más oscuro */
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
  color: #333333;
}

.search-input {
  border: 1px solid #cccccc;
  border-radius: 5px;
  padding: 0.5rem;
  background-color: #ffffff; /* Fondo blanco */
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1); /* Apariencia de relieve */
}

.search-input:focus {
  border-color: #007bff; /* Resaltado azul en foco */
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5); /* Sombra azul */
}

/* Carrusel de solicitudes aceptadas */
.dashboard-aceptadas {
  margin-top: 2rem;
}

.aceptada-card {
  background-color: #ffffff; /* Fondo blanco */
  border: 1px solid #4a90e2; /* Borde azul vibrante */
  color: #333333;
  text-align: center;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Sombras suaves */
  transition: transform 0.2s, box-shadow 0.3s;
}

.aceptada-card:hover {
  background-color: #eaf4ff; /* Fondo azul claro */
  transform: scale(1.02);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15); /* Sombras más intensas */
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  width: 80%;
  max-width: 500px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.modal-content h3 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
  color: #333333;
}

.modal-buttons button {
  padding: 0.5rem 1rem;
  margin: 0 0.5rem;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  font-weight: bold;
}

.modal-buttons button.btn-cerrar-modal {
  background-color: #ff4d4f; /* Rojo vibrante */
  color: white;
}

.modal-buttons button.btn-cerrar-modal:hover {
  background-color: #cc0000;
}

.modal-buttons button.btn-confirmar {
  background-color: #4caf50; /* Verde */
  color: white;
}

.modal-buttons button.btn-confirmar:hover {
  background-color: #2e7d32; /* Verde más oscuro */
}
</style>



