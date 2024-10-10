<template>
    <div class="dashboard-layout">
      <!-- Sidebar -->
      <div class="sidebar">
        <div class="logo">
          <h2>Mi Dashboard</h2>
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
              <router-link to="/settings" class="nav-link">
                <i class="fas fa-cog"></i> Configuración
              </router-link>
            </li>
            <li>
              <router-link to="/reports" class="nav-link">
                <i class="fas fa-chart-bar"></i> Reportes
              </router-link>
            </li>
            <li>
            <router-link to="/manage-requests" class="nav-link">
              <i class="fas fa-tasks"></i> Gestionar Solicitudes
            </router-link>
          </li> 
            <li>
              <router-link to="/manage-courses" class="nav-link">
                <i class="fas fa-book"></i> Gestionar Cursos
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
      <div class="main-content">
        <h1 class="page-title">Gestión de Cursos</h1>
        <table class="cursos-table">
          <thead>
            <tr>
              <th>Título del Curso</th>
              <th>Docente Teoría</th>
              <th>Docente Práctico</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="curso in cursos" :key="curso.Pk_Curso">
              <td>{{ curso.titulo_curso }}</td>
              <td>{{ curso.Fk_docenteteoria }}</td>
              <td>{{ curso.Fk_docentepractico }}</td>
              <td>
                <button @click="crearCurso" class="btn-crud">Crear</button>
                <button @click="leerCurso(curso.Pk_Curso)" class="btn-crud">Leer</button>
                <button @click="actualizarCurso(curso.Pk_Curso)" class="btn-crud">Actualizar</button>
                <button @click="eliminarCurso(curso.Pk_Curso)" class="btn-crud btn-danger">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  import { supabase } from '@/supabase.js';
  
  export default {
    data() {
      return {
        cursos: []
      };
    },
    async mounted() {
      // Obtener la lista de cursos desde Supabase
      let { data: cursos, error } = await supabase
        .from('Cursos')
        .select('*');
  
      if (error) {
        console.error("Error al obtener cursos:", error);
      } else {
        this.cursos = cursos;
      }
    },
    methods: {
      async crearCurso() {
        // Lógica para crear un curso
        console.log('Crear curso');
      },
      async leerCurso(id) {
        // Lógica para leer un curso por ID
        console.log('Leer curso con ID:', id);
      },
      async actualizarCurso(id) {
        // Lógica para actualizar un curso por ID
        console.log('Actualizar curso con ID:', id);
      },
      async eliminarCurso(id) {
        // Lógica para eliminar un curso por ID
        console.log('Eliminar curso con ID:', id);
      },
      async logout() {
        await supabase.auth.signOut();
        this.$router.push('/login');
      }
    }
  };
  </script>
  
  <style scoped>
  /* Layout similar al Sidebar anterior */
  .dashboard-layout {
    display: flex;
    height: 100vh;
  }
  
  /* Sidebar */
  .sidebar {
    width: 250px;
    height: 100vh;
    background-color: #333;
    color: #fff;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 20px;
  }
  
  .logo {
    margin-bottom: 40px;
  }
  
  .logo h2 {
    color: #fff;
    font-size: 24px;
  }
  
  nav ul {
    list-style: none;
    padding: 0;
    width: 100%;
  }
  
  nav ul li {
    width: 100%;
  }
  
  .nav-link {
    display: flex;
    align-items: center;
    padding: 15px 20px;
    color: #fff;
    text-decoration: none;
    font-size: 16px;
    transition: background-color 0.3s;
  }
  
  .nav-link i {
    margin-right: 10px;
  }
  
  .nav-link:hover {
    background-color: #444;
  }
  
  .logout-btn {
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    text-align: left;
    width: 100%;
    padding: 15px 20px;
    font-size: 16px;
    transition: background-color 0.3s;
  }
  
  .logout-btn:hover {
    background-color: #444;
  }
  
  /* Main content */
  .main-content {
    margin-left: 250px;
    width: calc(100% - 250px);
    padding: 20px;
  }
  
  .page-title {
    font-size: 2rem;
    margin-bottom: 20px;
  }
  
  .cursos-table {
    width: 100%;
    border-collapse: collapse;
    background-color: #f9f9f9;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
  
  .cursos-table th, .cursos-table td {
    padding: 1rem;
    text-align: center;
    border-bottom: 1px solid #ddd;
  }
  
  .cursos-table th {
    background-color: #f2f2f2;
    font-size: 1.2rem;
    font-weight: bold;
    color: #333;
  }
  
  .cursos-table td {
    font-size: 1rem;
  }
  
  .btn-crud {
    background-color: #2ecc71;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin: 0 5px;
    transition: background-color 0.3s ease;
  }
  
  .btn-crud:hover {
    background-color: #27ae60;
  }
  
  .btn-danger {
    background-color: #e74c3c;
  }
  
  .btn-danger:hover {
    background-color: #c0392b;
  }
  </style>
  