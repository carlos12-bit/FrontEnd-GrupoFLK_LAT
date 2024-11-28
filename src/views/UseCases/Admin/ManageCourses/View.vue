<template>
  <div class="container">
    <h1 class="page-title">Gestión de Cursos</h1>
    <button @click="goToCreateCourse" class="btn-create">Crear Curso</button>
    <div class="controls-container">
      <div class="pagination-controls">
        <label for="registrosPorPagina">Mostrar</label>
        <select v-model="registrosPorPagina" id="registrosPorPagina" class="pagination-select">
          <option v-for="num in [5, 10, 20]" :key="num" :value="num">{{ num }}</option>
        </select>
        <span>registros</span>
      </div>
      <div class="search-container">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Buscar por título exacto"
          class="search-input"
        />
      </div>
    </div>
    <table class="courses-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Título</th>
          <th>Docente Teoría</th>
          <th>Docente Práctica</th>
          <th>Ubicación Teoría</th>
          <th>Ubicación Práctica</th>
          <th>Opciones</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="curso in cursosFiltrados.slice((paginaActual - 1) * registrosPorPagina, paginaActual * registrosPorPagina)"
          :key="curso.pk_curso"
        >
          <td>{{ curso.pk_curso }}</td>
          <td>{{ curso.titulo_curso }}</td>
          <td>{{ getNombreFormador(curso.fk_docenteteoria) }}</td>
          <td>{{ getNombreInstructor(curso.fk_docentepractico) }}</td>
          <td>{{ getUbicacionTeoria(curso.fk_ubicacion_teoria) }}</td>
          <td>{{ getUbicacionPractica(curso.fk_ubicacion_practica) }}</td>
          <td>
            <button @click="viewCourse(curso.pk_curso)" class="view-btn">Ver</button>
            <button @click="goToEditCourse(curso.pk_curso)" class="edit-btn">Editar</button>
            <button @click="deleteCourse(curso.pk_curso)" class="delete-btn">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="pagination">
      <span>
        Mostrando {{ (paginaActual - 1) * registrosPorPagina + 1 }} a
        {{ Math.min(paginaActual * registrosPorPagina, cursosFiltrados.length) }} de
        {{ cursosFiltrados.length }} registros
      </span>
      <button @click="irPrimeraPagina" :disabled="paginaActual === 1">Primero</button>
      <button @click="irPaginaAnterior" :disabled="paginaActual === 1">Anterior</button>
      <input
        type="number"
        v-model.number="paginaActual"
        min="1"
        :max="numeroPaginas"
        @change="validarPagina"
        class="pagina-input"
      />
      <button @click="irPaginaSiguiente" :disabled="paginaActual === numeroPaginas">Siguiente</button>
      <button @click="irUltimaPagina" :disabled="paginaActual === numeroPaginas">Último</button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { supabase } from "@/supabase.js";
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();
    const cursos = ref([]);
    const formadores = ref([]);
    const instructores = ref([]);
    const ubicaciones = ref([]);
    const searchQuery = ref("");
    const registrosPorPagina = ref(5);
    const paginaActual = ref(1);

    const fetchCourses = async () => {
      let { data: Cursos, error } = await supabase.from("cursos").select("*");
      if (!error) cursos.value = Cursos;
      else console.error("Error al obtener los cursos:", error.message);
    };

    const fetchFormadores = async () => {
      let { data: Formador, error } = await supabase.from("Formador").select("*");
      if (!error) formadores.value = Formador;
      else console.error("Error al obtener formadores:", error.message);
    };

    const fetchInstructores = async () => {
      let { data: Instructor, error } = await supabase.from("Instructor").select("*");
      if (!error) instructores.value = Instructor;
      else console.error("Error al obtener instructores:", error.message);
    };

    const fetchUbicaciones = async () => {
      let { data: Ubicaciones, error } = await supabase.from("Ubicaciones").select("*");
      if (!error) ubicaciones.value = Ubicaciones;
      else console.error("Error al obtener ubicaciones:", error.message);
    };

    const cursosFiltrados = computed(() => {
      return cursos.value.filter((curso) => {
        // Filtro exacto por el título
        return !searchQuery.value || curso.titulo_curso === searchQuery.value;
      });
    });

    const numeroPaginas = computed(() => {
      return Math.ceil(cursosFiltrados.value.length / registrosPorPagina.value);
    });

    const getNombreFormador = (fk_docenteteoria) => {
      const formador = formadores.value.find((f) => f.Pk_docenteteoria === fk_docenteteoria);
      return formador ? formador.nombre : "Sin asignar";
    };

    const getNombreInstructor = (fk_docentepractico) => {
      const instructor = instructores.value.find((i) => i.Pk_docentepractico === fk_docentepractico);
      return instructor ? instructor.nombre : "Sin asignar";
    };

    const getUbicacionTeoria = (fk_ubicacion_teoria) => {
      const ubicacion = ubicaciones.value.find((u) => u.Pk_Ubicacion === fk_ubicacion_teoria);
      return ubicacion ? ubicacion.nombre_ubicacion : "Sin asignar";
    };

    const getUbicacionPractica = (fk_ubicacion_practica) => {
      const ubicacion = ubicaciones.value.find((u) => u.Pk_Ubicacion === fk_ubicacion_practica);
      return ubicacion ? ubicacion.nombre_ubicacion : "Sin asignar";
    };

    const viewCourse = (id) => {
      router.push({ path: "ManageCourses/Details", query: { id } });
    };

    const goToCreateCourse = () => {
      router.push("ManageCourses/Create");
    };

    const goToEditCourse = (id) => {
      router.push({ path: "ManageCourses/Edit", query: { id } });
    };

    const deleteCourse = async (id) => {
      const { error } = await supabase.from("cursos").delete().eq("pk_curso", id);
      if (!error) {
        cursos.value = cursos.value.filter((curso) => curso.pk_curso !== id);
        alert("Curso eliminado con éxito");
      } else {
        alert("Error al eliminar el curso");
      }
    };

    const irPrimeraPagina = () => {
      paginaActual.value = 1;
    };

    const irUltimaPagina = () => {
      paginaActual.value = numeroPaginas.value;
    };

    const irPaginaAnterior = () => {
      if (paginaActual.value > 1) paginaActual.value--;
    };

    const irPaginaSiguiente = () => {
      if (paginaActual.value < numeroPaginas.value) paginaActual.value++;
    };

    const validarPagina = () => {
      if (paginaActual.value < 1) paginaActual.value = 1;
      if (paginaActual.value > numeroPaginas.value) paginaActual.value = numeroPaginas.value;
    };

    onMounted(() => {
      fetchCourses();
      fetchFormadores();
      fetchInstructores();
      fetchUbicaciones();
    });

    return {
      cursos,
      cursosFiltrados,
      searchQuery,
      registrosPorPagina,
      paginaActual,
      numeroPaginas,
      getNombreFormador,
      getNombreInstructor,
      getUbicacionTeoria,
      getUbicacionPractica,
      viewCourse,
      goToCreateCourse,
      goToEditCourse,
      deleteCourse,
      irPrimeraPagina,
      irUltimaPagina,
      irPaginaAnterior,
      irPaginaSiguiente,
      validarPagina,
    };
  },
};
</script>

<style scoped>
/* Contenedor principal */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background-color: transparent; /* Fondo transparente */
  border-radius: 10px; /* Bordes suaves */
  box-shadow: none; /* Eliminar sombras */
}

/* Título */
.page-title {
  font-size: 2rem;
  color: #4a5c93; /* Color armonizado con el fondo */
  text-align: center;
  margin-bottom: 1rem;
  font-weight: bold;
}

/* Botón Crear Curso */
.btn-create {
  background-color: #4a5c93; /* Azul oscuro */
  color: white;
  padding: 0.5rem 1.2rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.btn-create:hover {
  background-color: #3b4a71; /* Azul más oscuro */
  transform: scale(1.05);
}

/* Tabla de cursos */
.courses-table {
  width: 100%;
  border-collapse: collapse;
  background-color: transparent; /* Fondo transparente */
  color: #4a5c93;
}

.courses-table th {
  background-color: rgba(112, 149, 210, 0.6); /* Fondo semitransparente */
  color: white;
  padding: 0.75rem;
  font-size: 1rem;
}

.courses-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid rgba(112, 149, 210, 0.4); /* Bordes suaves */
  background-color: transparent; /* Sin fondo */
}

/* Botones de acciones */
.view-btn,
.edit-btn,
.delete-btn {
  background-color: #4a5c93; /* Azul oscuro */
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 5px;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.view-btn:hover,
.edit-btn:hover,
.delete-btn:hover {
  background-color: #3b4a71; /* Azul más oscuro */
  transform: scale(1.05);
}

/* Controles de búsqueda y paginación */
.controls-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4a5c93;
}

.pagination-select {
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid rgba(112, 149, 210, 0.4);
  background-color: rgba(255, 255, 255, 0.8); /* Fondo semitransparente */
  color: #4a5c93;
}

.search-container {
  display: flex;
  justify-content: flex-end;
}

.search-input {
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid rgba(112, 149, 210, 0.4);
  font-size: 1rem;
  width: 300px;
  background-color: rgba(255, 255, 255, 0.8); /* Fondo semitransparente */
  color: #4a5c93;
}

/* Paginación */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.pagination button {
  padding: 0.5rem 1rem;
  background-color: #4a5c93; /* Azul oscuro */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.pagination button:disabled {
  background-color: #bdc3c7; /* Gris claro */
  cursor: not-allowed;
}

.pagination button:hover:enabled {
  background-color: #3b4a71; /* Azul más oscuro */
}

/* Estilo del input de página */
.pagina-input {
  width: 50px;
  padding: 0.5rem;
  text-align: center;
  border: 1px solid rgba(112, 149, 210, 0.4);
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.8); /* Fondo semitransparente */
  color: #4a5c93;
}
</style>

