<template>
  <div class="evaluacion-teorica">
    <div v-if="!evaluacionFinalizada" class="evaluacion-iniciada">
      <h2>{{ evaluacionSeleccionada.nombre_evaluacion }}</h2>
      <p><strong>Curso:</strong> {{ evaluacionSeleccionada.nombre_curso }}</p>
      
      <!-- Mostrar el contador de tiempo -->
      <div class="contador">
        <span>Tiempo restante: {{ tiempoRestante }} segundos</span>
      </div>

      <!-- Mostrar preguntas -->
      <div v-for="(pregunta, index) in preguntasEvaluacion" :key="pregunta.id" class="pregunta">
        <p><strong>{{ index + 1 }}. {{ pregunta.enunciado }}</strong></p>
        
        <div v-for="(opcion, i) in JSON.parse(pregunta.opciones)" :key="i" class="opciones">
          <input
            type="radio"
            :id="'opcion_' + pregunta.id + '_' + i"
            :name="'pregunta_' + pregunta.id"
            :value="opcion"
            v-model="respuestas[pregunta.id]"
            :disabled="evaluacionFinalizada"
          />
          <label :for="'opcion_' + pregunta.id + '_' + i">{{ opcion }}</label>
        </div>
      </div>

      <!-- Botón para enviar la evaluación -->
      <div v-if="!evaluacionFinalizada">
        <button @click="enviarEvaluacion" class="btn-enviar">Enviar Evaluación</button>
      </div>
    </div>

    <!-- Mostrar resultados -->
    <div v-if="evaluacionFinalizada" class="resultado">
      <h2>Resultados de la Evaluación</h2>
      <div v-for="(pregunta, index) in preguntasEvaluacion" :key="pregunta.id" class="pregunta">
        <p><strong>{{ index + 1 }}. {{ pregunta.enunciado }}</strong></p>
        <p><strong>Tu respuesta:</strong> {{ respuestas[pregunta.id] }}</p>
        <p v-if="respuestas[pregunta.id] === pregunta.respuesta_correcta">
          <span class="correcta">Respuesta correcta</span>
        </p>
        <p v-else>
          <span class="incorrecta">Respuesta incorrecta</span>
        </p>
        <p><strong>Respuesta correcta:</strong> {{ pregunta.respuesta_correcta }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from "@/supabase.js";

export default {
  name: "EvaluacionTeorica",
  data() {
    return {
      evaluacionSeleccionada: {},
      preguntasEvaluacion: [],
      respuestas: {},
      evaluacionFinalizada: false,
      tiempoRestante: 600, // 10 minutos en segundos
      intervalo: null
    };
  },
  async mounted() {
    const evaluacionId = this.$route.params.evaluacionId; // Obtener el ID de la evaluación desde la URL
    await this.obtenerEvaluacion(evaluacionId);
    await this.obtenerPreguntas(evaluacionId);
    this.iniciarContador();
  },
  methods: {
    async obtenerEvaluacion(idEvaluacion) {
      const { data, error } = await supabase
        .from("evaluaciones_teoricas")
        .select("id, respuestas, nota, aprobado")
        .eq("id", idEvaluacion)
        .single();

      if (error) {
        console.error("Error al obtener la evaluación:", error);
      } else {
        this.evaluacionSeleccionada = data;
      }
    },
    async obtenerPreguntas(idEvaluacion) {
      const { data: preguntas, error } = await supabase
        .from("preguntas_teoricas")
        .select("id, enunciado, opciones, respuesta_correcta, fk_evaluacion_teoria_cursos")
        .eq("fk_evaluacion_teoria_cursos", idEvaluacion);

      if (error) {
        console.error("Error al obtener las preguntas:", error);
      } else {
        this.preguntasEvaluacion = preguntas;
      }
    },
    iniciarContador() {
      this.intervalo = setInterval(() => {
        if (this.tiempoRestante > 0) {
          this.tiempoRestante--;
        } else {
          this.enviarEvaluacion(); // Enviar evaluación automáticamente cuando se acabe el tiempo
        }
      }, 1000);
    },
    async enviarEvaluacion() {
      clearInterval(this.intervalo); // Detener el contador
      this.evaluacionFinalizada = true;

      // Obtener el ID del operador (deberías obtener esto de algún estado global o del contexto)
      const operadorId = "operador-uuid-aqui"; // Ejemplo, reemplázalo por el ID real del operador.

      // Guardar las respuestas en la base de datos
      for (const preguntaId in this.respuestas) {
        const respuesta = this.respuestas[preguntaId];
        const pregunta = this.preguntasEvaluacion.find(p => p.id == preguntaId);

        const { error } = await supabase
          .from("respuestas_operador")
          .insert([
            {
              fk_evaluacion_teoria_cursos: pregunta.fk_evaluacion_teoria_cursos,
              fk_pregunta_teorica: pregunta.id,
              respuesta_operator: respuesta,
              operador_id: operadorId, // Usar el ID del operador
            }
          ]);

        if (error) {
          console.error("Error al guardar la respuesta:", error);
        }
      }

      // Aquí puedes realizar otras acciones tras el envío de la evaluación
      console.log("Respuestas enviadas:", this.respuestas);
    }
  },
  beforeDestroy() {
    clearInterval(this.intervalo); // Limpiar el intervalo si el componente se destruye
  }
};
</script>

<style scoped>
.evaluacion-teorica {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.evaluacion-iniciada h2 {
  font-size: 2rem;
  font-weight: bold;
}

.contador {
  margin: 20px 0;
  font-size: 1.2rem;
}

.pregunta {
  margin: 20px 0;
}

.opciones {
  margin-left: 20px;
}

.btn-enviar {
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-enviar:hover {
  background-color: #2980b9;
}

.resultado {
  margin-top: 30px;
}

.correcta {
  color: green;
}

.incorrecta {
  color: red;
}
</style>
