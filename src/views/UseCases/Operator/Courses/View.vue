<template>
  <div class="dashboard-container">
    <!-- Sidebar -->
    <div class="sidebar">
      <div class="logo">
        <img src="@/assets/FLK_Logo.png" alt="Logo Empresa" class="logo-img" /> <!-- Aquí carga la imagen del logo -->
      </div>
      <nav>
        <ul>
          <li>
            <router-link to="/dashboard" class="nav-link">
              <i class="fas fa-home"></i> Inicio
            </router-link>
          </li>
          <li>
            <router-link to="/profile" class="nav-link">
              <i class="fas fa-user"></i> Perfil
            </router-link>
          </li>
          <li>
            <router-link to="/reports" class="nav-link">
              <i class="fas fa-chart-bar"></i> Reportes
            </router-link>
          </li>
          <li>
            <router-link to="/operator-dashboard/Courses" class="nav-link">
              <i class="fas fa-tasks"></i> Mis Cursos
            </router-link>
          </li>
          <li>
            <router-link to="" class="nav-link">
              <i class="fas fa-calendar"></i> Sesiones Programadas
            </router-link>
          </li>
          <li>
            <router-link to="" class="nav-link">
              <i class="fas fa-calendar-alt"></i> Calendario de Actividades
            </router-link>
          </li>
          <li>
            <router-link to="" class="nav-link">
              <i class="fas fa-graduation-cap"></i> Calificaciones
            </router-link>
          </li>
          <li>
            <router-link to="" class="nav-link">
              <i class="fas fa-tasks"></i> Gestionar Evaluaciones
            </router-link>
          </li>
          <li>
            <router-link to="" class="nav-link">
              <i class="fas fa-chart-line"></i> Informe de Desempeño
            </router-link>
          </li>
          <li>
            <router-link to="" class="nav-link">
              <i class="fas fa-certificate"></i> Certificados
            </router-link>
          </li>
          <li>
            <button @click="logout" class="nav-link logout-btn">
              <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
            </button>
          </li>
        </ul>
      </nav>
    </div>

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
  min-height: 100vh;
}

/* Estilo para la barra lateral (menú hamburguesa) */
.sidebar {
  width: 250px;
  background-color: #2e2e2e;
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
.logo-img {
  max-width: 90%; /* Ajusta el tamaño del logo */
  height: auto;
  display: block;
  margin: 10px auto; /* Centra el logo horizontalmente */
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin-top: 20px;
}

.sidebar ul li a {
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
}

.sidebar ul li a i {
  margin-right: 10px; /* Espacio entre el ícono y el texto */
  font-size: 18px;
}

.sidebar ul li a:hover {
  background-color: #444;
  padding: 10px;
  border-radius: 5px;
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

.logout-btn {
  background-color: #3498db; /* Color celeste estático */
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 5px;
  text-align: left;
}

.logout-btn i {
  margin-right: 10px;
}

/* Elimina el cambio de color al hacer hover */
.logout-btn:hover {
  background-color: #3498db; /* Mantiene el mismo color */
}
</style>
