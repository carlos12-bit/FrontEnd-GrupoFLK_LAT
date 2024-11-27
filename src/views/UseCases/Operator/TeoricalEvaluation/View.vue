<template>
  <div class="evaluaciones-teoricas">
    <div class="evaluaciones-header">
      <h1>Evaluaciones Teóricas</h1>
      <div class="pagination-controls">
        <span>Mostrar</span>
        <select v-model="registrosPorPagina" class="pagination-select">
          <option v-for="num in [5, 10, 20]" :key="num" :value="num">{{ num }}</option>
        </select>
        <span>registros</span>
      </div>
    </div>

    <div class="cards-wrapper">
      <div 
        v-for="evaluacion in evaluacionesTeoricasPaginadas" 
        :key="evaluacion.id_evaluacion" 
        class="card"
      >
        <div class="card-header">
          <h3>{{ evaluacion.nombre_curso }}</h3>
        </div>
        <div class="card-body">
          <p><strong>Evaluación:</strong> {{ evaluacion.nombre_evaluacion }}</p>
          <p><strong>Puntaje:</strong> {{ evaluacion.puntaje }}%</p>
        </div>
        <div class="card-footer">
          <!-- Enlace para redirigir a la otra vista -->
          <router-link to="/operator-dashboard/RealizarEvaluacion">
          <button class="btn-iniciar-evaluacion">
          Iniciar Evaluación
          </button>
          </router-link>
    </div>
      </div>
    </div>

    <div class="pagination">
      <span>Mostrando {{ paginaActual * registrosPorPagina - registrosPorPagina + 1 }} a {{ Math.min(paginaActual * registrosPorPagina, evaluacionesTeoricas.length) }} de {{ evaluacionesTeoricas.length }} registros</span>
      <div class="pagination-buttons">
        <button @click="paginaActual = 1" :disabled="paginaActual === 1">Primero</button>
        <button @click="paginaActual--" :disabled="paginaActual === 1">Anterior</button>
        <button @click="paginaActual++" :disabled="paginaActual >= totalPaginas">Siguiente</button>
        <button @click="paginaActual = totalPaginas" :disabled="paginaActual >= totalPaginas">Último</button>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from '@/supabase.js';

export default {
  name: "EvaluacionesTeoricas",
  data() {
    return {
      evaluacionesTeoricas: [], // Lista de evaluaciones obtenidas
      preguntasEvaluacion: [], // Lista de preguntas obtenidas para la evaluación seleccionada
      respuestas: {}, // Almacenará las respuestas del operador
      modalVisible: false, 
      evaluacionSeleccionada: null, 
      resultado: '', // Resultado de la evaluación
      paginaActual: 1, // Página actual para la paginación
      registrosPorPagina: 5, // Registros por página en la paginación
    };
  },
  computed: {
    totalPaginas() {
      return Math.ceil(this.evaluacionesTeoricas.length / this.registrosPorPagina);
    },
    evaluacionesTeoricasPaginadas() {
      const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
      const fin = inicio + this.registrosPorPagina;
      return this.evaluacionesTeoricas.slice(inicio, fin);
    }
  },
  async mounted() {
    // Obtener las evaluaciones al montar el componente
    const { data: evaluaciones, error } = await supabase
      .from('asignatura') 
      .select(''); // Asegúrate de que 'asignatura' sea el nombre correcto de la tabla

    if (error) {
      console.error('Error al obtener evaluaciones:', error);
    } else {
      this.evaluacionesTeoricas = evaluaciones;
    }
  },
  methods: {
    abrirModal(evaluacion) {
      this.evaluacionSeleccionada = evaluacion;
      this.obtenerPreguntas(evaluacion.id_evaluacion); // Cargar preguntas cuando se abre el modal
      this.modalVisible = true;
    },
    cerrarModal() {
      this.modalVisible = false;
      this.preguntasEvaluacion = [];  // Limpiar las preguntas cuando se cierra el modal
      this.respuestas = {}; // Limpiar las respuestas
    },
    async obtenerPreguntas(idEvaluacion) {
      const { data: preguntas, error } = await supabase
        .from('preguntas_teoricas') // Cambiar por el nombre correcto de la tabla
        .select('*')
        .eq('fk_evaluacion_teoria_cursos', idEvaluacion); // Obtener preguntas relacionadas con la evaluación

      if (error) {
        console.error('Error al obtener preguntas:', error);
      } else {
        this.preguntasEvaluacion = preguntas;
      }
    },
    iniciarEvaluacion(evaluacion) {
      this.abrirModal(evaluacion); // Abre el modal cuando se hace clic en "Iniciar Evaluación"
    },
    verificarRespuestas() {
      let respuestasCorrectas = 0;
      this.preguntasEvaluacion.forEach(pregunta => {
        const respuestaSeleccionada = this.respuestas[pregunta.id];
        if (respuestaSeleccionada === pregunta.respuesta_correcta) {
          respuestasCorrectas++;
        }
      });

      // Mostrar resultado final
      const totalPreguntas = this.preguntasEvaluacion.length;
      this.resultado = `Respuestas correctas: ${respuestasCorrectas} de ${totalPreguntas}`;
    },
    async enviarEvaluacion() {
      // Aquí se puede enviar las respuestas del operador a la base de datos o realizar alguna acción
      console.log('Respuestas:', this.respuestas);
      // Ejemplo de acción posterior:
      // await supabase.from('respuestas').insert([...]);
      
      // Cerrar modal después de enviar la evaluación
      this.cerrarModal();
      alert("Evaluación enviada con éxito.");
    }
  }
};
</script>

<style scoped>
.evaluaciones-teoricas {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.evaluaciones-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.evaluaciones-header h1 {
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
}

.pagination-controls {
  display: flex;
  align-items: center;
}

.pagination-controls select {
  padding: 5px 10px;
  margin-left: 10px;
  font-size: 1rem;
}

.cards-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-between;
}

.card {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  width: 30%;
  padding: 20px;
  cursor: pointer;
  transition: transform 0.3s;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card:hover {
  transform: scale(1.05);
}

.card-header h3 {
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.card-body p {
  margin: 5px 0;
}

.card-footer {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.btn-iniciar-evaluacion {
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-iniciar-evaluacion:hover {
  background-color: #2980b9;
}

.pagination {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.pagination-buttons button {
  padding: 0.5rem 1rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.pagination-buttons button:hover {
  background-color: #2980b9;
}

.pagination-buttons button:disabled {
  background-color: #BDC3C7;
  cursor: not-allowed;
}

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
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  text-align: center;
}

.btn-cerrar {
  background-color: #3498db;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
}

.btn-cerrar:hover {
  background-color: #2980b9;
}

.pregunta-item {
  margin-bottom: 15px;
}

.opcion {
  margin-left: 10px;
}

.btn-enviar {
  padding: 10px 20px;
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-enviar:hover {
  background-color: #27ae60;
}
</style>
