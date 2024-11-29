<template>
  <div class="create-evaluation-container">
    <img src="@/assets/SELLO_FLK.png" alt="Logo FLK" class="logo" />
    <h2>Evaluación "Grupo FLK"</h2>
    <form @submit.prevent="guardarEvaluacion">
      <div class="form-group" v-for="(pregunta, index) in preguntas" :key="index">
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
          <div v-for="(opcion, i) in pregunta.opciones" :key="i" class="opcion">
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
          <select v-model="pregunta.respuesta_correcta" :id="'respuesta-' + index" required>
            <option disabled value="">Seleccione la respuesta correcta</option>
            <option v-for="(opcion, i) in pregunta.opciones" :key="i" :value="opcion">
              {{ opcion }}
            </option>
          </select>
        </div>
      </div>

      <button type="button" @click="agregarPregunta">Agregar Pregunta</button>
      <button type="submit" class="guardar-button">Guardar Evaluación</button>
      <button type="button" class="editar-button" v-if="modoEdicion" @click="actualizarEvaluacion">
        Actualizar Evaluación
      </button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fk_curso: 1, // ID del curso asociado (puedes hacer dinámico si es necesario)
      preguntas: [],
      modoEdicion: false, // Activar si estás editando una evaluación
    };
  },
  methods: {
    async cargarEvaluacion() {
      try {
        const { data, error } = await this.$supabase
          .from("preguntas_teoricas")
          .select("id")
          .eq("fk_curso", this.fk_curso); // Filtrar por curso

        if (error) throw error;

        // Convertir las opciones de JSON a array y cargar preguntas
        this.preguntas = data.map((pregunta) => ({
          enunciado: pregunta.enunciado,
          opciones: JSON.parse(pregunta.opciones),
          respuesta_correcta: pregunta.respuesta_correcta,
        }));

        this.modoEdicion = true; // Activar modo de edición
      } catch (error) {
        console.error("Error al cargar la evaluación:", error.message);
      }
    },
    agregarPregunta() {
      this.preguntas.push({
        enunciado: "",
        opciones: ["", "", "", ""],
        respuesta_correcta: "",
      });
    },
    async guardarEvaluacion() {
      try {
        const evaluacion = this.preguntas.map((pregunta) => ({
          fk_curso: this.fk_curso,
          enunciado: pregunta.enunciado,
          opciones: JSON.stringify(pregunta.opciones), // Convertir opciones a JSON
          respuesta_correcta: pregunta.respuesta_correcta,
        }));

        const { data, error } = await this.$supabase
          .from("preguntas_teoricas")
          .insert(evaluacion);

        if (error) throw error;

        alert("Evaluación creada exitosamente.");
        this.preguntas = []; // Reiniciar preguntas después de guardar
      } catch (error) {
        console.error("Error al guardar la evaluación:", error.message);
        alert("Hubo un error al guardar la evaluación.");
      }
    },
    async actualizarEvaluacion() {
      try {
        // Elimina las preguntas anteriores para reemplazar por las nuevas
        const { error: deleteError } = await this.$supabase
          .from("preguntas_teoricas")
          .delete()
          .eq("fk_curso", this.fk_curso);

        if (deleteError) throw deleteError;

        // Inserta las nuevas preguntas
        await this.guardarEvaluacion();
        alert("Evaluación actualizada exitosamente.");
      } catch (error) {
        console.error("Error al actualizar la evaluación:", error.message);
        alert("Hubo un error al actualizar la evaluación.");
      }
    },
  },
  mounted() {
    // Cargar evaluación existente al montar el componente
    this.cargarEvaluacion();
  },
};
</script>

<style scoped>
.create-evaluation-container {
  max-width: 800px;
  text-align: left;
  padding-left: 50px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f3e2;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
h2 {
  text-align: center;
  margin-bottom: 10px; /* Reduce el margen inferior */
  margin-top: -58px; /* Ajusta el margen superior para subir el título */
  font-size: 24px; /* Opcional: Ajusta el tamaño del texto */
}
.logo {
  width: 200px;
  height: auto;
  margin-left: auto; /* Centrar horizontalmente */
  display: block;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input,
select {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-right: 10px;
}

button:hover {
  background-color: #45a049;
}

.guardar-button {
  background-color: #2196f3;
}

.guardar-button:hover {
  background-color: #1e88e5;
}

.editar-button {
  background-color: #f57c00;
}

.editar-button:hover {
  background-color: #e65100;
}
</style>
