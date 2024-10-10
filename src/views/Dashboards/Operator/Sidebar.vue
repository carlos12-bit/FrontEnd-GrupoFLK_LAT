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
  </div>
</template>

<script>
import { supabase } from '@/supabase.js';

export default {
  methods: {
    async logout() {
      await supabase.auth.signOut();
      this.$router.push('/login');
    }
  }
};
</script>


<style scoped>
.dashboard-container {
  display: flex;
  min-height: 100vh; /* Hace que el contenedor ocupe toda la altura de la pantalla */
}

/* Ajuste del sidebar */
.sidebar {
  width: 250px;
  background-color: #333; /* Cambiar el color a negro o el tono que prefieras */
  color: white;
  padding: 20px;
  min-height: 100vh; /* Mantiene el sidebar al menos del tamaño de la ventana */
  position: fixed; /* Fija el sidebar para que siempre esté visible */
  top: 0;
  left: 0;
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

.sidebar ul li {
  margin-bottom: 10px; /* Aumenta el espacio entre las opciones */
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

/* Estilo para el contenido principal */
.content {
  margin-left: 250px; /* Desplaza el contenido a la derecha del sidebar */
  padding: 20px;
  width: calc(100% - 250px); /* Asegura que el contenido use el espacio restante */
}
</style>
