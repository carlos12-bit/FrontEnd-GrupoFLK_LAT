<template>
  <div class="create-evaluation-container">
    <img src="@/assets/SELLO_FLK.png" alt="Logo FLK" class="logo" />
    <h2>Evaluación "Grupo FLK"</h2>

    <div v-if="materias.length" class="materias-container">
      <h3>Materias Asignadas</h3>
      <div class="materia" v-for="materia in materias" :key="materia.pk_curso">
        <button
          class="materia-boton"
          @click="seleccionarMateria(materia)"
        >
          {{ materia.titulo_curso }}
        </button>
      </div>
    </div>
    <div v-else>
      <p>No hay materias asignadas a este docente.</p>
    </div>

    <div v-if="mostrarFormulario" class="formulario-container">
      <h3>Formulario de Evaluación</h3>
      <p><strong>Materia seleccionada:</strong> {{ materiaSeleccionada.titulo_curso }}</p>

      <form @submit.prevent="guardarEvaluacion">
        <div
          class="form-group"
          v-for="(pregunta, index) in preguntas"
          :key="index"
        >
          <label :for="'pregunta-' + index">Pregunta {{ index + 1 }}</label>
          <input
            type="text"
            v-model="pregunta.enunciado"
            :id="'pregunta-' + index"
            placeholder="Escriba el enunciado de la pregunta"
            required
          />

          <div class="opciones-container">
            <label>Opciones:</label>
            <div
              v-for="(opcion, i) in pregunta.opciones"
              :key="i"
              class="opcion"
            >
              <input
                type="text"
                v-model="pregunta.opciones[i]"
                :placeholder="'Opción ' + (i + 1)"
                required
              />
            </div>
          </div>

          <div class="respuesta-correcta-container">
            <label :for="'respuesta-' + index">Respuesta Correcta</label>
            <select
              v-model="pregunta.respuesta_correcta"
              :id="'respuesta-' + index"
              required
            >
              <option disabled value="">Seleccione la respuesta correcta</option>
              <option
                v-for="(opcion, i) in pregunta.opciones"
                :key="i"
                :value="opcion"
              >
                {{ opcion }}
              </option>
            </select>
          </div>
        </div>

        <button
          type="button"
          class="agregar-pregunta-boton"
          @click="agregarPregunta"
          :disabled="preguntas.length >= 15"
        >
          Agregar más preguntas ({{ preguntas.length }}/15)
        </button>

        <button type="submit" class="guardar-boton">Guardar Evaluación</button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { supabase } from "@/supabase";

export default {
  data() {
    return {
      docenteId: 3,
      materias: [], 
      materiaSeleccionada: {}, 
      preguntas: [], 
      mostrarFormulario: false, 
    };
  },
  
  methods: {
    // Función para cargar las materias asignadas al docente
    async cargarMaterias() {
      /*const user = supabase.auth.user();  // Obtener el usuario autenticado
      if (user) {
        this.docenteId = user.id;  // Asignar el ID del usuario autenticado
      } else {
        console.error("Usuario no autenticado");
        return;
      }*/

      try {
        // Realizar la consulta para obtener las materias asignadas al docente
        const { data, error } = await supabase
          .from("cursos")
          .select("pk_curso, titulo_curso")
          .eq("fk_docenteteoria", this.docenteId);

        if (error) throw error;

        this.materias = data || [];  // Asignar las materias obtenidas a la variable 'materias'
      } catch (error) {
        console.error("Error al cargar las materias:", error.message);
      }
    },

    // Función para seleccionar una materia
    seleccionarMateria(materia) {
      this.materiaSeleccionada = materia;  // Asignar la materia seleccionada
      this.mostrarFormulario = true;  // Mostrar el formulario de evaluación
      this.inicializarPreguntas();  // Inicializar las preguntas
    },

    // Función para inicializar las preguntas
    inicializarPreguntas() {
      this.preguntas = Array.from({ length: 1 }, () => ({
        enunciado: "",
        opciones: Array(4).fill(""),
        respuesta_correcta: "",
      }));
    },

    // Función para agregar más preguntas
    agregarPregunta() {
      if (this.preguntas.length < 15) {
        this.preguntas.push({
          enunciado: "",
          opciones: Array(4).fill(""),
          respuesta_correcta: "",
        });
      }
    },

    // Función para guardar la evaluación
    async guardarEvaluacion() {
      try {
        const materiaId = this.materiaSeleccionada.pk_curso;

        for (const pregunta of this.preguntas) {
          const { enunciado, opciones, respuesta_correcta } = pregunta;

          // Insertar las preguntas en la base de datos
          const { error } = await supabase.from("preguntas_teoricas").insert({
            fk_curso: materiaId,
            enunciado,
            opciones: JSON.stringify(opciones),  // Convertir las opciones a un string JSON
            respuesta_correcta,
          });

          if (error) {
            console.error("Error al guardar la pregunta:", error.message);
            alert(`Error al guardar la pregunta: ${enunciado}`);
            return;
          }
        }

        alert("¡Evaluación guardada con éxito!");
        this.mostrarFormulario = false;
        this.preguntas = [];  // Limpiar las preguntas después de guardarlas
      } catch (error) {
        console.error("Error inesperado:", error);
        alert("Ocurrió un error al guardar la evaluación.");
      }
    },
  },

  // Cargar las materias cuando se monta el componente
  mounted() {
    this.cargarMaterias();
  },
};
</script>


<style scoped>

.create-evaluation-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
  text-align: center;
}

.logo {
  width: 150px;
  height: auto;
  margin-bottom: 20px;
}

h2 {
  font-size: 24px;
  margin-bottom: 10px;
  font-weight: bold;
  color: #333;
}

h3 {
  font-size: 20px;
  margin-bottom: 15px;
  color: #555;
}

.materias-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
  width: 100%;
}

.materia-boton {
  border: none;
  background-color: #007bff;
  color: white;
  padding: 20px 25px;
  border-radius: 10px;
  cursor: pointer;
  text-align: center;
  width: 200px;
  height: 80px;
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.2);
  font-size: 15px;
  font-weight: bold;
}

.materia-boton:hover {
  background-color: #0056b3;
}

.formulario-container {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #f9f9f9;
  width: 100%;
  max-width: 800px;
}

.form-group {
  margin-bottom: 20px;
}

input[type="text"],
select {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-top: 5px;
}

.opciones-container,
.respuesta-correcta-container {
  margin-top: 15px;
}

.guardar-boton {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 20px;
}

.guardar-boton:hover {
  background-color: #218838;
}

.agregar-pregunta-boton {
  background-color: #ffc107;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  margin: 15px 0;
}

.agregar-pregunta-boton:disabled {
  background-color: #e0a800;
  cursor: not-allowed;
}

.agregar-pregunta-boton:hover:not(:disabled) {
  background-color: #e0a800;
}
</style>
