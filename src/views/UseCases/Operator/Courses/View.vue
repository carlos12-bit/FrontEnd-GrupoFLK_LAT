<template>
    <div class="dashboard-container">
      <!-- Sidebar -->
      <Sidebar /> <!-- Componente Sidebar para reutilizar -->
    <!-- Contenido principal -->
    <div class="content">
      <h2>Gestión de Cursos</h2>
      <!-- Tabla de cursos -->
      <table class="courses-table">
        <thead>
          <tr>
            <th>Título del Curso</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="curso in cursos" :key="curso.Pk_Curso">
            <td>{{ curso.titulo_curso }}</td>
            <td>
              <button @click="viewCourse(curso)">Ver</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { supabase } from '@/supabase.js';

export default {
  setup() {
    const cursos = ref([]);

    const fetchCourses = async () => {
      let { data: Cursos, error } = await supabase.from('Cursos').select('*');
      if (!error) {
        cursos.value = Cursos;
      }
    };

    fetchCourses();

    const viewCourse = (curso) => {
      // Aquí puedes mostrar los detalles del curso
      alert(`Detalles del curso: ${curso.titulo_curso}`);
    };

    return {
      cursos,
      viewCourse,
    };
  },
};
</script>

<style scoped>
/* Estilo para el contenedor principal del dashboard */
.dashboard-container {
  display: flex;
}

/* Estilo para la barra lateral (menú hamburguesa) */
.sidebar {
  width: 250px;
  background-color: #2c3e50;
  color: white;
  padding: 20px;
  min-height: 100vh;
}

.sidebar-header {
  margin-bottom: 20px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar ul li {
  margin: 10px 0;
}

.sidebar ul li a {
  color: white;
  text-decoration: none;
}

.sidebar ul li a:hover {
  text-decoration: underline;
}

/* Estilo para el contenido principal */
.content {
  flex-grow: 1;
  padding: 20px;
}

.courses-table {
  width: 100%;
  border-collapse: collapse;
}

.courses-table th,
.courses-table td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: left;
}

.courses-table th {
  background-color: #f4f4f4;
}

button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

button:hover {
  background-color: #2980b9;
}
</style>
