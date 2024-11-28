<template>
  <div class="container">
    <h1>Realizar Evaluación</h1>
    <p>Tiempo Restante: {{ tiempoRestante }}</p>
    <form @submit.prevent="finalizarEvaluacion">
      <div v-for="pregunta in preguntas" :key="pregunta.id" class="pregunta">
        <p>{{ pregunta.enunciado }}</p>
        <div v-for="(opcion, key) in pregunta.opciones" :key="key" class="opcion">
          <label>
            <input
              type="radio"
              :name="'pregunta_' + pregunta.id"
              :value="key"
              v-model="respuestas[pregunta.id]"
              :disabled="finalizada"
            />
            {{ opcion }}
          </label>
        </div>
      </div>
      <button v-if="!finalizada" type="submit" class="btn">Terminar Evaluación</button>
    </form>

    <div v-if="finalizada" class="resultado">
      <h2>Resultados</h2>
      <div v-for="pregunta in preguntas" :key="'resultado_' + pregunta.id">
        <p>
          <strong>{{ pregunta.enunciado }}</strong><br />
          Tu respuesta: {{ respuestas[pregunta.id] || "Sin responder" }}<br />
          Respuesta correcta: {{ pregunta.respuesta_correcta }}<br />
        </p>
      </div>
      <h3>Puntaje Total: {{ puntajeTotal }}</h3>
    </div>
  </div>
</template>

<script>
import { supabase } from '@/supabase.js';

export default {
  data() {
    return {
      preguntas: [],
      respuestas: {},
      tiempoRestante: "00:10:00",
      finalizada: false,
      puntajeTotal: 0,
    };
  },
  methods: {
    async fetchPreguntas() {
      const cursoId = this.$route.params.cursoId;
      const { data, error } = await supabase
        .from("preguntas_teoricas")
        .select("id, enunciado, opciones, respuesta_correcta")
        .eq("fk_curso", cursoId);

      if (error) {
        console.error(error);
      } else {
        this.preguntas = data;
      }
    },
    finalizarEvaluacion() {
      this.finalizada = true;
      this.calcularPuntaje();
    },
    calcularPuntaje() {
      this.puntajeTotal = this.preguntas.reduce((total, pregunta) => {
        return total + (this.respuestas[pregunta.id] === pregunta.respuesta_correcta ? 1 : 0);
      }, 0);

      // Aquí se actualiza la tabla en la base de datos si es necesario
      supabase
        .from("preguntas_teoricas")
        .update({ respuestas: this.respuestas, puntaje_total: this.puntajeTotal })
        .eq("fk_operador", 1); // Ajusta según el operador autenticado
    },
  },
  mounted() {
    this.fetchPreguntas();
  },
};
</script>

<style>
.container {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}
.pregunta {
  margin: 20px 0;
  text-align: left;
}
.opcion {
  margin: 5px 0;
}
.resultado {
  margin: 20px 0;
}
.btn {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>