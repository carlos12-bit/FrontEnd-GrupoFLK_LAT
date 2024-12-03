<template>
  <div class="container">
    <h1 class="page-title">Crear Evaluación Práctica</h1>
    <form @submit.prevent="submitEvaluacion" class="evaluacion-form">
      <!-- Seleccionar Curso -->
      <div class="curso-container">
        <label for="fk_curso" class="curso-label">Curso</label>
        <select id="fk_curso" v-model="fk_curso" required class="curso-select">
          <option value="" disabled>Selecciona un curso</option>
          <option v-for="curso in cursos" :key="curso.pk_curso" :value="curso.pk_curso">
            {{ curso.titulo_curso }}
          </option>
        </select>
      </div>

      <!-- Seleccionar Operador -->
      <div class="operador-container">
        <label for="fk_operador" class="operador-label">Operador</label>
        <select id="fk_operador" v-model="fk_operador" required class="operador-select">
          <option value="" disabled>Selecciona un operador</option>
          <option v-for="operador in operadores" :key="operador.Pk_Alumno" :value="operador.Pk_Alumno">
            {{ operador.nombre }}
          </option>
        </select>
      </div>

      <!-- Enunciados y Respuestas -->
      <div v-for="(enunciado, index) in enunciados" :key="index" class="enunciado-container">
        <label :for="'enunciado-' + index" class="enunciado-label">
          {{ index + 1 }}. {{ enunciado }}
        </label>
        <div class="respuesta-options">
          <label>
            <input
              type="radio"
              :name="'respuesta-' + index"
              :value="'Sí'"
              v-model="respuestas[index]"
              required
            />
            Sí
          </label>
          <label>
            <input
              type="radio"
              :name="'respuesta-' + index"
              :value="'No'"
              v-model="respuestas[index]"
            />
            No
          </label>
        </div>
      </div>

      <!-- Observaciones -->
      <div class="observaciones-container">
        <label for="observaciones" class="observaciones-label">Observaciones</label>
        <textarea
          id="observaciones"
          v-model="observaciones"
          placeholder="Ingrese observaciones (opcional)"
          class="observaciones-input"
        ></textarea>
      </div>

      <!-- Galería -->
      <div class="galeria-container">
        <label for="galeria" class="galeria-label">Galería (Fotos o Videos)</label>
        <input
          type="file"
          id="galeria"
          @change="handleFileUpload"
          accept="image/*,video/*"
          class="galeria-input"
        />
        <div v-if="galeriaNombre" class="galeria-preview">
          <p><strong>Archivo seleccionado:</strong> {{ galeriaNombre }}</p>
        </div>
      </div>

      <!-- Botones -->
      <div class="form-buttons">
        <button type="submit" class="btn-submit">Guardar Evaluación</button>
        <button type="button" @click="cancelar" class="btn-cancel">Cancelar</button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { supabase } from "@/supabase.js";

export default {
  setup() {
    const enunciados = ref([
      "¿El operador conoce las reglas de seguridad?",
      "¿El operador usa equipo de protección personal?",
      "¿El operador sigue los procedimientos correctamente?",
    ]);
    const respuestas = ref(Array(enunciados.value.length).fill(null));
    const observaciones = ref("");
    const fk_curso = ref(null);
    const fk_operador = ref(null);
    const cursos = ref([]);
    const operadores = ref([]);
    const galeriaNombre = ref(null);
    const galeriaArchivo = ref(null);

    // Obtener todos los cursos disponibles
    const fetchCursos = async () => {
      const { data, error } = await supabase.from("cursos").select("pk_curso, titulo_curso");
      if (!error) {
        cursos.value = data;
      } else {
        console.error("Error al obtener cursos:", error.message);
      }
    };

    // Obtener todos los operadores disponibles
    const fetchOperadores = async () => {
      const { data, error } = await supabase.from("Operador").select("Pk_Alumno, nombre");
      if (!error) {
        operadores.value = data;
      } else {
        console.error("Error al obtener operadores:", error.message);
      }
    };

    // Manejar la subida de archivos
    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        galeriaNombre.value = file.name;
        galeriaArchivo.value = file;
      }
    };
    // Subir archivo a Supabase Storage
    const subirArchivo = async () => {
      if (!galeriaArchivo.value) return null;

      const { data, error } = await supabase.storage
        .from("Evaluacion_Practica")
        .upload(`galeria/${galeriaArchivo.value.name}`, galeriaArchivo.value);

      if (error) {
        console.error("Error al subir archivo:", error.message);
        return null;
      }
      return data.path; // Ruta del archivo subido
    };

    // Enviar evaluación
    const submitEvaluacion = async () => {
      if (!fk_curso.value || !fk_operador.value) {
        alert("Por favor, seleccione un curso y un operador.");
        return;
      }

      const galeriaPath = await subirArchivo();

      try {
        const { error } = await supabase.from("evaluacion_practica").insert({
          fk_curso: fk_curso.value,
          fk_operador: fk_operador.value,
          enunciados: enunciados.value,
          respuestas: respuestas.value.join(","), // Almacenar respuestas como texto separado por comas
          observaciones: observaciones.value,
          galeria: galeriaPath,
          fecha_creacion: new Date(),
        });

        if (error) {
          throw error;
        }

        alert("Evaluación registrada con éxito");
        limpiarFormulario();
      } catch (error) {
        console.error("Error al registrar evaluación:", error.message);
        alert("Hubo un error al registrar la evaluación.");
      }
    };

    // Limpiar formulario
    const limpiarFormulario = () => {
      respuestas.value = Array(enunciados.value.length).fill(null);
      observaciones.value = "";
      fk_curso.value = null;
      fk_operador.value = null;
      galeriaNombre.value = null;
      galeriaArchivo.value = null;
    };

    // Cancelar y limpiar
    const cancelar = () => {
      limpiarFormulario();
      alert("Evaluación cancelada.");
    };

    // Cargar datos al montar el componente
    onMounted(() => {
      fetchCursos();
      fetchOperadores();
    });

    return {
      enunciados,
      respuestas,
      observaciones,
      fk_curso,
      fk_operador,
      cursos,
      operadores,
      galeriaNombre,
      submitEvaluacion,
      handleFileUpload,
      cancelar,
    };
  },
};
</script>


<style scoped>
/* Contenedor principal */
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 8px 8px rgba(0, 0, 0, 0.1);
}

/* Título de la página */
.page-title {
  font-size: 2rem;
  color: #333;
  text-align: center;
  margin-bottom: 1rem;
  font-weight: bold;
}

/* Estilo del formulario */
.evaluacion-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Enunciados */
.enunciado-container {
  display: flex;
  flex-direction: column;
}

.enunciado-label {
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
}

.respuesta-options {
  display: flex;
  gap: 1rem;
}

.respuesta-options label {
  font-size: 1rem;
  color: #333;
}

/* Observaciones */
.observaciones-container {
  display: flex;
  flex-direction: column;
}

.observaciones-label {
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
}

.observaciones-input {
  width: 100%;
  height: 100px;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  resize: none;
}

/* Curso */
.curso-container {
  display: flex;
  flex-direction: column;
}

.curso-label {
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
}

.curso-select {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
}

/* Curso */
.operador-container {
  display: flex;
  flex-direction: column;
}

.operador-label {
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
}

.operador-select {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
}

/* Botones */
.form-buttons {
  display: flex;
  justify-content: space-between;
}

.btn-submit {
  background-color: #4caf50;
  color: white;
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.btn-submit:hover {
  background-color: #388e3c;
  transform: scale(1.05);
}

.btn-cancel {
  background-color: #f44336;
  color: white;
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.btn-cancel:hover {
  background-color: #d32f2f;
  transform: scale(1.05);
}
</style>
