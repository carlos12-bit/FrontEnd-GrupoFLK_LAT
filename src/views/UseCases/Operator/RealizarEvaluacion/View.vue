<template>
  <div class="form-container">
    <!-- Examen Teórico -->
    <div v-if="!mostrarResultados">
      <h1>Examen Teórico</h1>
      <form @submit.prevent="submitAnswers" class="form">
        <div v-for="(pregunta, index) in preguntas" :key="pregunta.id" class="pregunta">
          <h3>{{ index + 1 }}. {{ pregunta.enunciado }}</h3>
          <div v-for="(opcion, idx) in pregunta.opciones" :key="idx" class="opcion">
            <label>
              <input
                type="radio"
                :name="'pregunta-' + pregunta.id"
                :value="opcion"
                v-model="respuestas[pregunta.id]"
                required
              />
              {{ opcion }}
            </label>
          </div>
        </div>
        <button type="submit" class="submit-button">Enviar Respuestas</button>
      </form>
    </div>

    <!-- Resultados del Examen -->
    <div v-if="mostrarResultados" class="vista-resultados">
      <h1>Resultados del Examen</h1>
      <table class="resultados-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Pregunta</th>
            <th>Respuesta Correcta</th>
            <th>Tu Respuesta</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(resultado, index) in resultados" :key="resultado.id">
            <td>{{ index + 1 }}</td>
            <td>{{ resultado.enunciado }}</td>
            <td>{{ resultado.correcta }}</td>
            <td :class="{ correcto: resultado.correcta === resultado.respuesta, incorrecto: resultado.correcta !== resultado.respuesta }">
              {{ resultado.respuesta }}
            </td>
          </tr>
        </tbody>
      </table>
      <h2>Puntaje Total: {{ puntajeTotal }} / {{ preguntas.length }}</h2>
    </div>
  </div>
</template>

<script>
import { supabase } from "@/supabase.js";

export default {
  data() {
    return {
      preguntas: [],
      respuestas: {},
      mostrarResultados: false,
      resultados: [],
      puntajeTotal: 0,
    };
  },
  async created() {
    try {
      const { data, error } = await supabase
        .from('preguntas_teoricas')
        .select('id, enunciado, opciones, respuesta_correcta');

      if (error) {
        console.error('Error al obtener las preguntas:', error);
        return;
      }

      this.preguntas = data.map((pregunta) => ({
        ...pregunta,
        opciones: pregunta.opciones,
      }));
    } catch (error) {
      console.error('Error general:', error);
    }
  },
  methods: {
    async submitAnswers() {
      const respuestasArray = Object.keys(this.respuestas).map((id) => ({
        pregunta_id: parseInt(id),
        respuesta: this.respuestas[id],
        fecha_envio: new Date().toISOString(),
      }));

      try {
        const { data, error } = await supabase.from('respuestas').insert(respuestasArray);

        if (error) {
          console.error('Error al enviar respuestas:', error);
          alert('Hubo un error al enviar las respuestas.');
          return;
        }

        alert('Respuestas enviadas con éxito.');

        // Procesar resultados
        this.resultados = this.preguntas.map((pregunta) => ({
          id: pregunta.id,
          enunciado: pregunta.enunciado,
          correcta: pregunta.respuesta_correcta,
          respuesta: this.respuestas[pregunta.id] || 'No respondida',
        }));

        // Calcular puntaje
        this.puntajeTotal = this.resultados.filter(
          (resultado) => resultado.correcta === resultado.respuesta
        ).length;

        this.mostrarResultados = true; // Mostrar los resultados
      } catch (error) {
        console.error('Error general al enviar:', error);
        alert('Error inesperado al enviar las respuestas.');
      }
    },
  },
};
</script>

<style scoped>
.form-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: #333;
  font-size: 2rem;
  margin-bottom: 30px;
}

.form {
  display: flex;
  flex-direction: column;
}

.pregunta {
  margin-bottom: 20px;
  padding: 10px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.pregunta h3 {
  font-size: 1.1rem;
  color: #555;
}

.opcion {
  margin-left: 20px;
  font-size: 1rem;
  color: #555;
}

input[type="radio"] {
  margin-right: 10px;
}

.submit-button {
  padding: 12px 24px;
  background-color: #007BFF;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #0056b3;
}

.submit-button:active {
  background-color: #004085;
}

.vista-resultados {
  margin-top: 40px;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.resultados-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.resultados-table th, .resultados-table td {
  padding: 12px;
  border: 1px solid #ddd;
  text-align: center;
}

.resultados-table th {
  background-color: #f2f2f2;
}

.correcto {
  color: green;
}

.incorrecto {
  color: red;
}

@media (max-width: 600px) {
  .form-container {
    padding: 15px;
  }

  h1 {
    font-size: 1.5rem;
  }

  .submit-button {
    font-size: 1rem;
    padding: 10px 20px;
  }

  .pregunta {
    padding: 8px;
  }

  .pregunta h3 {
    font-size: 1rem;
  }

  .opcion {
    font-size: 0.9rem;
  }
}
</style>
