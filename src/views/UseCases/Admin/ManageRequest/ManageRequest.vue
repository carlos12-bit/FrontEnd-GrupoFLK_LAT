<template>
  <div class="container">
    <h1 class="page-title">Gestión de Solicitudes de Capacitación</h1>

    <!-- Contenedor de controles de búsqueda y selección de registros -->
    <div class="controls-container">
      <!-- Control de número de registros por página -->
      <div class="pagination-controls">
        <label for="registrosPorPagina">Mostrar</label>
        <select v-model="registrosPorPagina" id="registrosPorPagina">
          <option v-for="num in [5, 10, 20]" :key="num" :value="num">{{ num }}</option>
        </select>
        <span>registros</span>
      </div>

      <!-- Campo de búsqueda -->
      <div class="search-container">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Buscar solicitud por nombre del curso o solicitante"
          class="search-input"
        />
      </div>
    </div>

    <!-- Tabla de solicitudes -->
    <table class="solicitudes-table">
      <thead>
        <tr>
          <th>Nombre del Curso</th>
          <th>Fecha de Solicitud</th>
          <th>Estado</th>
          <th>Opciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="solicitud in solicitudesPaginadas" :key="solicitud.id_solicitud">
          <td>{{ getNombreCurso(solicitud.Fk_Curso) }}</td>
          <td>{{ formatFecha(solicitud.fecha_solicitud) }}</td>
          <td>{{ solicitud.estado || 'Sin asignar' }}</td>
          <td>
            <button @click="viewSolicitud(solicitud)" class="view-btn">Ver</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Controles de paginación -->
    <div class="pagination">
      <span>Mostrando {{ inicioPagina }} a {{ finPagina }} de {{ solicitudesFiltradas.length }} registros</span>
      <button @click="paginaActual = 1" :disabled="paginaActual === 1">Primero</button>
      <button @click="paginaActual--" :disabled="paginaActual === 1">Anterior</button>
      <button @click="paginaActual++" :disabled="paginaActual >= totalPaginas">Siguiente</button>
      <button @click="paginaActual = totalPaginas" :disabled="paginaActual >= totalPaginas">Último</button>
    </div>

    <!-- Carrusel de Solicitudes Aceptadas -->
    <div class="dashboard-aceptadas">
      <h2 class="dashboard-title">Gestión de Solicitudes Aceptadas</h2>
      <div class="carousel">
        <button @click="prevCard" class="carousel-button left">‹</button>
        <div class="aceptadas-grid" ref="aceptadasGrid">
          <div
            v-for="solicitud in solicitudesAceptadasOrdenadas"
            :key="solicitud.id_solicitud"
            class="aceptada-card"
            @click="abrirModal(solicitud)"
          >
            <h3>{{ getNombreCurso(solicitud.Fk_Curso) || 'Sin curso' }}</h3>
            <p><strong>Fecha de Solicitud:</strong> {{ formatFecha(solicitud.fecha_solicitud) }}</p>
            <p><strong>Solicitante:</strong> {{ solicitud.nombre_completo }}</p>
          </div>
        </div>
        <button @click="nextCard" class="carousel-button right">›</button>
      </div>
    </div>

    <!-- Modal de Detalles de la Solicitud -->
    <div v-if="modalVisible" class="modal-overlay" @click.self="cerrarModal">
      <div class="modal-content">
        <h3>Detalles de la Solicitud</h3>
       
        <p><strong>ID Solicitud:</strong> {{ detalleSolicitud.id_solicitud }}</p>
        <p><strong>Nombre Completo:</strong> {{ detalleSolicitud.nombre_completo }}</p>
        <p><strong>Teléfono:</strong> {{ detalleSolicitud.nro_telefonico }}</p>
        <p><strong>DNI:</strong> {{ detalleSolicitud.dni }}</p>
        <p><strong>Fecha de Nacimiento:</strong> {{ formatFecha(detalleSolicitud.fecha_nacimiento) }}</p>
        <p><strong>Dirección:</strong> {{ detalleSolicitud.direccion }}</p>
        <p><strong>Teléfono de Contacto:</strong> {{ detalleSolicitud.telefono_contacto }}</p>
        <p><strong>Correo Electrónico:</strong> {{ detalleSolicitud.correo_electronico }}</p>
        <p><strong>Nacionalidad:</strong> {{ detalleSolicitud.nacionalidad }}</p>
        <p><strong>Ocupación Actual:</strong> {{ detalleSolicitud.ocupacion_actual }}</p>
        <p><strong>Nombre de Empresa:</strong> {{ detalleSolicitud.nombre_empresa }}</p>
        <p><strong>Cargo Actual:</strong> {{ detalleSolicitud.cargo_actual }}</p>
        <p><strong>Experiencia en Maquinaria:</strong> {{ detalleSolicitud.experiencia_maquinaria }}</p>
        <p><strong>Contacto de Emergencia:</strong> {{ detalleSolicitud.nombre_contacto_emergencia }}</p>
        <p><strong>Relación con Contacto de Emergencia:</strong> {{ detalleSolicitud.relacion_contacto_emergencia }}</p>
        <p><strong>Teléfono de Contacto de Emergencia:</strong> {{ detalleSolicitud.telefono_contacto_emergencia }}</p>
        <p><strong>Curso Seleccionado:</strong> {{ getNombreCurso(detalleSolicitud.Fk_Curso) }}</p>
        <p><strong>Fecha Inicio Preferida:</strong> {{ formatFecha(detalleSolicitud.fecha_inicio_preferida) }}</p>
        <p><strong>Turno Preferido:</strong> {{ detalleSolicitud.turno_preferido }}</p>
        <p><strong>Adjunto DNI:</strong> {{ detalleSolicitud.dni_adjunto }}</p>
        <p><strong>Certificado Médico Adjunto:</strong> {{ detalleSolicitud.certificado_medico_adjunto }}</p>
        <p><strong>Licencia de Conducir Adjunto:</strong> {{ detalleSolicitud.licencia_conducir_adjunto }}</p>
        <p><strong>Alergias o Condiciones:</strong> {{ detalleSolicitud.alergias_condiciones }}</p>
        <p><strong>Necesidades Especiales:</strong> {{ detalleSolicitud.necesidades_especiales }}</p>
        <p><strong>Consentimiento de Participación:</strong> {{ detalleSolicitud.consentimiento_participacion ? 'Sí' : 'No' }}</p>
        <p><strong>Autorización de Imagen:</strong> {{ detalleSolicitud.autorizacion_imagen ? 'Sí' : 'No' }}</p>
        <p><strong>Fecha de Solicitud:</strong> {{ formatFecha(detalleSolicitud.fecha_solicitud) }}</p>
        <p><strong>Consentimiento de Tratamiento de Datos:</strong> {{ detalleSolicitud.consentimiento_tratamiento_datos ? 'Sí' : 'No' }}</p>
        <p><strong>Firma:</strong> {{ detalleSolicitud.firma }}</p>
        <p><strong>Estado:</strong> {{ detalleSolicitud.estado }}</p>
        
        <button @click="cerrarModal" class="btn-cerrar-modal">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { supabase } from '@/supabase.js';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    const solicitudes = ref([]);
    const cursos = ref([]);
    const searchQuery = ref("");
    const modalVisible = ref(false);
    const detalleSolicitud = ref(null);
    const paginaActual = ref(1);
    const registrosPorPagina = ref(5);

    const fetchSolicitudes = async () => {
      let { data: Solicitud_Capacitacion, error } = await supabase.from('Solicitud_Capacitacion').select('*');
      if (!error) {
        solicitudes.value = Solicitud_Capacitacion.sort((a, b) => new Date(b.fecha_solicitud) - new Date(a.fecha_solicitud));
      }
    };

    const fetchCursos = async () => {
      let { data: Cursos, error } = await supabase.from('Cursos').select('*');
      if (!error) cursos.value = Cursos;
    };

    const getNombreCurso = (fk_curso) => {
      const curso = cursos.value.find(c => c.Pk_Curso === fk_curso);
      return curso ? curso.titulo_curso : 'Curso no encontrado';
    };

    const formatFecha = (fecha) => {
      if (!fecha) return 'Sin fecha';
      const date = new Date(fecha);
      return date.toLocaleDateString();
    };

    const viewSolicitud = (solicitud) => {
      router.push({ path: 'ManageRequest/Details', query: { id: solicitud.id_solicitud } });
    };

    const abrirModal = (solicitud) => {
      detalleSolicitud.value = solicitud;
      modalVisible.value = true;
    };

    const cerrarModal = () => {
      modalVisible.value = false;
      detalleSolicitud.value = null;
    };

    const solicitudesFiltradas = computed(() => {
      let filtered = solicitudes.value;

      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(solicitud =>
          (getNombreCurso(solicitud.Fk_Curso) || '').toLowerCase().includes(query) ||
          (solicitud.nombre_completo || '').toLowerCase().includes(query)
        );
      }

      return filtered;
    });

    const totalPaginas = computed(() => {
      return Math.ceil(solicitudesFiltradas.value.length / registrosPorPagina.value);
    });

    const solicitudesPaginadas = computed(() => {
      const inicio = (paginaActual.value - 1) * registrosPorPagina.value;
      const fin = inicio + registrosPorPagina.value;
      return solicitudesFiltradas.value.slice(inicio, fin);
    });

    const solicitudesAceptadasOrdenadas = computed(() => {
      return solicitudes.value
        .filter(solicitud => solicitud.estado === 'Aceptada')
        .sort((a, b) => new Date(b.fecha_solicitud) - new Date(a.fecha_solicitud));
    });

    const inicioPagina = computed(() => {
      return (paginaActual.value - 1) * registrosPorPagina.value + 1;
    });

    const finPagina = computed(() => {
      return Math.min(inicioPagina.value + registrosPorPagina.value - 1, solicitudesFiltradas.value.length);
    });

    onMounted(() => {
      fetchSolicitudes();
      fetchCursos();
    });

    return {
      solicitudes,
      solicitudesFiltradas,
      solicitudesPaginadas,
      solicitudesAceptadasOrdenadas,
      searchQuery,
      modalVisible,
      detalleSolicitud,
      registrosPorPagina,
      paginaActual,
      totalPaginas,
      inicioPagina,
      finPagina,
      getNombreCurso,
      formatFecha,
      viewSolicitud,
      abrirModal,
      cerrarModal
    };
  }
};
</script>

<style scoped>
/* Contenedor de controles de búsqueda y selección de registros */
.controls-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

/* Estilos del contenedor de búsqueda */
.search-container {
  display: flex;
  align-items: center;
}

.search-input {
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 300px;
  font-size: 1rem;
}

/* Estilos del selector de número de registros */
.pagination-controls {
  display: flex;
  align-items: center;
}

.pagination-controls label,
.pagination-controls span {
  margin-right: 0.5rem;
}

/* Contenedor principal */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f4f4f9;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* Título de la página */
.page-title {
  font-size: 2rem;
  color: #333;
  text-align: center;
  margin-bottom: 1rem;
  font-weight: bold;
}

/* Tabla */
.solicitudes-table {
  width: 100%;
  border-collapse: collapse;
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

/* Botón Ver */
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

/* Paginación */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
  font-size: 1rem;
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

/* Dashboard de Solicitudes Aceptadas */
.dashboard-aceptadas {
  margin-top: 2rem;
}

.dashboard-title {
  text-align: center;
  font-size: 2rem;
  color: #1A5276;
  margin-bottom: 1rem;
  font-weight: bold;
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
</style>
