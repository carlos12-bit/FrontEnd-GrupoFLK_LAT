<template>
  <div class="container">
    <h1 class="page-title">Gestión de Solicitudes de Capacitación</h1>
    <div class="table-container">
      <table class="solicitudes-table">
        <thead>
          <tr>
            <th>Curso</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="solicitud in solicitudes" :key="solicitud.id_solicitud">
            <td>{{ obtenerTituloCurso(solicitud.Fk_Curso) || 'Sin curso' }}</td>
            <td>{{ solicitud.fecha_solicitud ? new Date(solicitud.fecha_solicitud).toLocaleDateString() : 'Sin fecha' }}</td>
            <td>
              <span :class="getEstadoClase(solicitud.estado)">
                {{ solicitud.estado || 'Sin estado' }}
              </span>
            </td>
            <td>
              <button @click="verDetalles(solicitud.id_solicitud)" class="btn-ver">Ver</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Sección de Dashboard de Solicitudes Aceptadas -->
    <div class="dashboard-aceptadas">
      <h2 class="dashboard-title">Solicitudes Aceptadas</h2>
      <div class="carousel">
        <button @click="prevCard" class="carousel-button left">‹</button>
        <div class="aceptadas-grid" ref="aceptadasGrid">
          <div
            v-for="solicitud in solicitudesAceptadas"
            :key="solicitud.id_solicitud"
            class="aceptada-card"
            @click="abrirModal(solicitud)"
          >
            <h3>{{ obtenerTituloCurso(solicitud.Fk_Curso) || 'Sin curso' }}</h3>
            <p><strong>Fecha de Solicitud:</strong> {{ new Date(solicitud.fecha_solicitud).toLocaleDateString() }}</p>
            <p><strong>Solicitante:</strong> {{ solicitud.nombre_completo }}</p>
          </div>
        </div>
        <button @click="nextCard" class="carousel-button right">›</button>
      </div>
    </div>

    <!-- Modal de Detalles -->
    <div v-if="modalVisible" class="modal-overlay" @click.self="cerrarModal">
      <div class="modal-content">
        <h3>Detalles de la Solicitud</h3>
        <p><strong>Curso:</strong> {{ obtenerTituloCurso(detalleSolicitud?.Fk_Curso) || 'Sin curso' }}</p>
        <p><strong>Fecha de Solicitud:</strong> {{ detalleSolicitud?.fecha_solicitud ? new Date(detalleSolicitud.fecha_solicitud).toLocaleDateString() : 'Sin fecha' }}</p>
        <p><strong>Solicitante:</strong> {{ detalleSolicitud?.nombre_completo }}</p>
        <button @click="cerrarModal" class="btn-cerrar-modal">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from '@/supabase.js';

export default {
  name: "GestionarSolicitudes",
  data() {
    return {
      solicitudes: [],
      cursos: [],
      solicitudesAceptadas: [],
      modalVisible: false,
      detalleSolicitud: null,
      cardIndex: 0 // Índice para el desplazamiento de una tarjeta a la vez
    };
  },
  async mounted() {
    let { data: solicitudes, error: errorSolicitudes } = await supabase
      .from('Solicitud_Capacitacion')
      .select('*');

    if (errorSolicitudes) {
      console.error("Error fetching solicitudes: ", errorSolicitudes);
    } else {
      this.solicitudes = solicitudes;
      this.solicitudesAceptadas = solicitudes.filter(solicitud => solicitud.estado === 'Aceptada');
    }

    let { data: cursos, error: errorCursos } = await supabase
      .from('Cursos')
      .select('Pk_Curso, titulo_curso');

    if (errorCursos) {
      console.error("Error fetching cursos: ", errorCursos);
    } else {
      this.cursos = cursos;
    }
  },
  methods: {
    obtenerTituloCurso(fkCurso) {
      const curso = this.cursos.find(curso => curso.Pk_Curso === fkCurso);
      return curso ? curso.titulo_curso : null;
    },
    verDetalles(idSolicitud) {
      this.$router.push({ name: 'Details', params: { id: idSolicitud } });
    },
    getEstadoClase(estado) {
      if (estado === 'Aceptada') {
        return 'estado-aceptada';
      } else if (estado === 'Rechazada') {
        return 'estado-rechazada';
      } else {
        return 'estado-pendiente';
      }
    },
    prevCard() {
      if (this.cardIndex > 0) {
        this.cardIndex--;
        this.scrollToCurrentCard();
      }
    },
    nextCard() {
      if (this.cardIndex < this.solicitudesAceptadas.length - 4) {
        this.cardIndex++;
        this.scrollToCurrentCard();
      }
    },
    scrollToCurrentCard() {
      const grid = this.$refs.aceptadasGrid;
      const cardWidth = grid.querySelector(".aceptada-card").offsetWidth;
      grid.scrollTo({
        left: this.cardIndex * (cardWidth + 10), // Ajuste para margen
        behavior: "smooth"
      });
    },
    abrirModal(solicitud) {
      this.detalleSolicitud = solicitud;
      this.modalVisible = true;
    },
    cerrarModal() {
      this.modalVisible = false;
      this.detalleSolicitud = null;
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f4f4f9;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.page-title {
  text-align: center;
  font-size: 2rem;
  color: #1A5276;
  margin-bottom: 2rem;
  font-weight: bold;
}

.table-container {
  overflow-x: auto;
}

.solicitudes-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #f9f9f9;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.solicitudes-table th, .solicitudes-table td {
  padding: 1rem;
  text-align: center;
  border-bottom: 1px solid #ddd;
}

.solicitudes-table th {
  background-color: #f2f2f2;
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

.solicitudes-table td {
  font-size: 1rem;
}

.btn-ver {
  background-color: #2ecc71;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-ver:hover {
  background-color: #27ae60;
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

.aceptada-card:active {
  transform: scale(0.97);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

/* Modal de Detalles */
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
}

.modal-content {
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  max-width: 500px;
  width: 90%;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-content h3 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
}

.modal-content p {
  font-size: 1rem;
  color: #555;
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
</style>
