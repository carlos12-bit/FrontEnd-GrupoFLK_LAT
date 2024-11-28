<template>
  <div class="container">
    <h1 class="page-title">Estado de Certificado</h1>

    <!-- Control de número de registros por página -->
    <div class="pagination-controls">
      <label for="registrosPorPagina">Mostrar</label>
      <select v-model="registrosPorPagina" id="registrosPorPagina">
        <option v-for="num in [5, 10, 20]" :key="num" :value="num">{{ num }}</option>
      </select>
      <span>registros</span>
    </div>

    <!-- Tabla de Solicitudes -->
    <div class="table-container">
      <table class="solicitudes-table">
        <thead>
          <tr>
            <th>Curso</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Opciones</th>
            <th>Certificado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="solicitud in solicitudesPaginadas" :key="solicitud.id_solicitud">
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
            <td>
              <button 
                v-if="evaluacionesAprobadas(solicitud)" 
                @click="exportarCertificado(solicitud)" 
                class="btn-exportar">
                Exportar Certificado
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Controles de paginación -->
    <div class="pagination">
      <span>Mostrando {{ paginaActual * registrosPorPagina - registrosPorPagina + 1 }} a {{ Math.min(paginaActual * registrosPorPagina, solicitudes.length) }} de {{ solicitudes.length }} registros</span>
      <button @click="paginaActual = 1" :disabled="paginaActual === 1">Primero</button>
      <button @click="paginaActual--" :disabled="paginaActual === 1">Anterior</button>
      <button @click="paginaActual++" :disabled="paginaActual >= totalPaginas">Siguiente</button>
      <button @click="paginaActual = totalPaginas" :disabled="paginaActual >= totalPaginas">Último</button>
    </div>
  </div>
</template>

<script>
import { supabase } from '@/supabase.js';
import jsPDF from 'jspdf';

export default {
  name: "GestionarSolicitudes",
  data() {
    return {
      solicitudes: [],
      cursos: [],
      paginaActual: 1,
      registrosPorPagina: 5
    };
  },
  computed: {
    totalPaginas() {
      return Math.ceil(this.solicitudes.length / this.registrosPorPagina);
    },
    solicitudesPaginadas() {
      const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
      const fin = inicio + this.registrosPorPagina;
      return this.solicitudes.slice(inicio, fin);
    }
  },
  async mounted() {
    let { data: solicitudes, error: errorSolicitudes } = await supabase
      .from('Solicitud_Capacitacion')
      .select('*');

    if (errorSolicitudes) {
      console.error("Error fetching solicitudes: ", errorSolicitudes);
    } else {
      this.solicitudes = solicitudes;
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
    // Método para verificar si ambas evaluaciones están aprobadas
    evaluacionesAprobadas(solicitud) {
      return solicitud.evaluacion_teorica === 'Aprobada' && solicitud.evaluacion_practica === 'Aprobada';
    },
    // Método para generar el PDF del certificado y guardar en la base de datos
    async exportarCertificado(solicitud) {
      const doc = new jsPDF();
      const curso = this.obtenerTituloCurso(solicitud.Fk_Curso) || 'Sin curso';
      const fechaSolicitud = solicitud.fecha_solicitud ? new Date(solicitud.fecha_solicitud).toLocaleDateString() : 'Sin fecha';

      doc.setFontSize(16);
      doc.text("Certificado de Capacitación", 20, 20);
      doc.setFontSize(12);
      doc.text(`Curso: ${curso}`, 20, 40);
      doc.text(`Solicitante: ${solicitud.nombre_completo}`, 20, 50);
      doc.text(`Fecha de Solicitud: ${fechaSolicitud}`, 20, 60);
      doc.text(`Evaluación Teórica: ${solicitud.evaluacion_teorica}`, 20, 70);
      doc.text(`Evaluación Práctica: ${solicitud.evaluacion_practica}`, 20, 80);
      doc.text("Este es un certificado oficial que valida la participación en el curso de capacitación.", 20, 100);

      // Descargar el PDF
      doc.save(`${curso}_Certificado_${solicitud.nombre_completo}.pdf`);

      // Insertar los datos en la tabla Certificado
      const { error } = await supabase
        .from('Certificado')
        .insert([
          {
            id_solicitud: solicitud.id_solicitud,
            nombre_completo: solicitud.nombre_completo,
            curso: curso,
            fecha_solicitud: solicitud.fecha_solicitud,
            evaluacion_teorica: solicitud.evaluacion_teorica,
            evaluacion_practica: solicitud.evaluacion_practica,
            fecha_emision: new Date().toISOString(),
            estado_certificado: 'Emitido'
          }
        ]);

      if (error) {
        console.error("Error al insertar certificado: ", error);
      } else {
        console.log("Certificado insertado correctamente");
      }
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

.pagination-controls {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.pagination-controls label,
.pagination-controls span {
  margin-right: 0.5rem;
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

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.pagination button {
  padding: 0.5rem 1rem;
  margin-left: 0.5rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.pagination button:hover {
  background-color: #2980b9;
}

.pagination button:disabled {
  background-color: #BDC3C7;
  cursor: not-allowed;
}

.btn-exportar {
  background-color: #27ae60;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-exportar:hover {
  background-color: #2ecc71;
}
</style>
