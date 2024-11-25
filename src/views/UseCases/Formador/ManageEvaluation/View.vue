<template>
  <div class="evaluation-container">
    <h1>Evaluación Teórica</h1>

    <!-- Información del Alumno y Curso -->
    <div class="student-info">
      <p><strong>Alumno:</strong> {{ alumno.nombre_completo }}</p>
      <p><strong>Curso:</strong> {{ cursoSeleccionado }}</p>
    </div>

    <!-- Formulario de Evaluación -->
    <form @submit.prevent="finalizarEvaluacion">
      <div v-for="(pregunta, index) in preguntas" :key="pregunta.id" class="question">
        <p><strong>{{ index + 1 }}. {{ pregunta.enunciado }}</strong></p>
        <div v-for="opcion in pregunta.opciones" :key="opcion">
          <label>
            <input
              type="radio"
              :name="'pregunta-' + pregunta.id"
              :value="opcion"
              v-model="respuestas[pregunta.id]"
            />
            {{ opcion }}
          </label>
        </div>
      </div>

      <!-- Botón para finalizar la evaluación -->
      <button type="submit" class="submit-button">Finalizar Evaluación</button>
    </form>

    <!-- Botón para agregar nuevas preguntas (formador) -->
    <div v-if="esFormador">
      <h2>Agregar Nuevas Preguntas</h2>
      <button @click="mostrarModalAgregarPregunta" class="add-button">Agregar Pregunta</button>

      <!-- Modal para agregar una pregunta -->
      <div v-if="mostrarModal" class="modal">
        <h3>Nueva Pregunta</h3>
        <label>Enunciado:</label>
        <textarea v-model="nuevaPregunta.enunciado" rows="3"></textarea>

        <label>Opciones:</label>
        <div v-for="(opcion, index) in nuevaPregunta.opciones" :key="index">
          <input
            type="text"
            v-model="nuevaPregunta.opciones[index]"
            placeholder="Escribe una opción"
          />
        </div>
        <button @click="agregarOpcion" class="add-option">Agregar Opción</button>

        <label>Respuesta Correcta:</label>
        <select v-model="nuevaPregunta.respuesta_correcta">
          <option v-for="opcion in nuevaPregunta.opciones" :key="opcion" :value="opcion">
            {{ opcion }}
          </option>
        </select>

        <button @click="guardarPregunta" class="save-button">Guardar Pregunta</button>
        <button @click="cerrarModal" class="close-button">Cancelar</button>
      </div>
    </div>

    <!-- Mostrar resultados -->
    <div v-if="resultado">
      <h2>Resultados</h2>
      <p><strong>Nota:</strong> {{ resultado.nota }}</p>
      <p><strong>Respuestas Correctas:</strong></p>
      <ul>
        <li v-for="respuesta in resultado.correctas" :key="respuesta.id">
          Pregunta {{ respuesta.id }}: {{ respuesta.respuesta_correcta }}
        </li>
      </ul>
    </div>
  </div>
</template>

---

#### Script del Componente

```javascript
<script>
import { ref, onMounted } from "vue";
import { supabase } from "@/supabase";

export default {
  name: "EvaluacionTeorica",
  setup() {
    const preguntas = ref([]); // Preguntas de la evaluación
    const respuestas = ref({}); // Respuestas seleccionadas por el alumno
    const resultado = ref(null); // Resultado final de la evaluación
    const cursoSeleccionado = ref("Manejo de Montacargas"); // Curso actual
    const alumno = ref({ nombre_completo: "Carlos Martínez" }); // Alumno actual (simulado)
    const esFormador = true; // Simulación de permisos de formador

    // Estado para agregar preguntas
    const mostrarModal = ref(false);
    const nuevaPregunta = ref({
      enunciado: "",
      opciones: ["", ""], // Por defecto, dos opciones mínimas
      respuesta_correcta: "",
    });

    // Cargar preguntas de la tabla `preguntas_teoricas`
    const cargarPreguntas = async () => {
      try {
        const { data, error } = await supabase
          .from("preguntas_teoricas")
          .select("*")
          .eq("fk_curso", 1); // Filtrar por curso

        if (error) throw error;
        preguntas.value = data;
      } catch (error) {
        console.error("Error al cargar preguntas:", error.message);
      }
    };

    // Finalizar la evaluación
    const finalizarEvaluacion = async () => {
      try {
        const respuestasCorrectas = preguntas.value.filter(
          (pregunta) => respuestas.value[pregunta.id] === pregunta.respuesta_correcta
        );

        const nota = (respuestasCorrectas.length / preguntas.value.length) * 100;

        // Guardar evaluación en la tabla `evaluaciones_teoricas`
        const { error } = await supabase.from("evaluaciones_teoricas").insert({
          fk_alumno: 1, // ID del alumno
          fk_curso: 1, // ID del curso
          respuestas: respuestas.value,
          nota: nota,
          aprobado: nota >= 70,
          respuestas_correctas: respuestasCorrectas.map((r) => ({
            id: r.id,
            respuesta_correcta: r.respuesta_correcta,
          })),
          fecha_realizacion: new Date(),
        });

        if (error) throw error;

        resultado.value = {
          nota,
          correctas: respuestasCorrectas,
        };

        alert("Evaluación finalizada con éxito.");
      } catch (error) {
        console.error("Error al finalizar evaluación:", error.message);
        alert("Error al finalizar la evaluación.");
      }
    };

    // Mostrar modal para agregar pregunta
    const mostrarModalAgregarPregunta = () => {
      mostrarModal.value = true;
    };

    // Cerrar modal
    const cerrarModal = () => {
      mostrarModal.value = false;
      nuevaPregunta.value = { enunciado: "", opciones: ["", ""], respuesta_correcta: "" };
    };

    // Agregar una opción de respuesta
    const agregarOpcion = () => {
      nuevaPregunta.value.opciones.push("");
    };

    // Guardar nueva pregunta en la tabla `preguntas_teoricas`
    const guardarPregunta = async () => {
      try {
        if (
          !nuevaPregunta.value.enunciado ||
          nuevaPregunta.value.opciones.length < 2 ||
          !nuevaPregunta.value.respuesta_correcta
        ) {
          alert("Completa todos los campos antes de guardar.");
          return;
        }

        const { error } = await supabase.from("preguntas_teoricas").insert({
          fk_curso: 1, // ID del curso
          enunciado: nuevaPregunta.value.enunciado,
          opciones: nuevaPregunta.value.opciones,
          respuesta_correcta: nuevaPregunta.value.respuesta_correcta,
          autor: "formador_id", // ID del formador
          fecha_creacion: new Date(),
        });

        if (error) throw error;

        alert("Pregunta guardada con éxito.");
        cerrarModal();
        cargarPreguntas(); // Recargar preguntas
      } catch (error) {
        console.error("Error al guardar la pregunta:", error.message);
      }
    };

    // Cargar preguntas al montar el componente
    onMounted(cargarPreguntas);

    return {
      preguntas,
      respuestas,
      resultado,
      cursoSeleccionado,
      alumno,
      esFormador,
      mostrarModal,
      nuevaPregunta,
      finalizarEvaluacion,
      mostrarModalAgregarPregunta,
      cerrarModal,
      agregarOpcion,
      guardarPregunta,
    };
  },
};
</script>
<style scoped>
.evaluation-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1, h2, h3 {
  text-align: center;
}

.student-info, .question {
  margin-bottom: 20px;
}

.add-button, .submit-button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.add-option, .save-button, .close-button {
  margin-top: 10px;
  background-color: #008cba;
  color: white;
  border: none;
  padding: 5px 15px;
  border-radius: 5px;
  cursor: pointer;
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border: 1px solid #ccc;
  padding: 20px;
  width: 400px;
  z-index: 10;
}
</style>
