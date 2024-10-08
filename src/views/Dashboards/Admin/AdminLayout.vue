<template>
  <div>
    <!-- Botón de menú para mostrar/ocultar el sidebar -->
    <!-- El botón permanece visible, tanto para abrir como para cerrar el sidebar -->
    <button @click="toggleSidebar" class="btn btn-primary menu-btn" type="button">
      <i v-if="!isSidebarVisible" class="fas fa-bars"></i> <!-- Icono de hamburger -->
      <i v-else class="fas fa-times"></i> <!-- Icono de cerrar -->
    </button>
    
    <!-- Sidebar -->
    <div :class="['sidebar', { 'sidebar-hidden': !isSidebarVisible }]">
      <div class="logo">
        <h2>Mi Dashboard</h2>
      </div>
      <nav>
        <ul class="nav flex-column">
          <li class="nav-item">
            <router-link to="/admin-dashboard" class="nav-link">
              <i class="fas fa-home"></i> Inicio
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/profile" class="nav-link">
              <i class="fas fa-user"></i> Perfil
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/settings" class="nav-link">
              <i class="fas fa-cog"></i> Configuración
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/reports" class="nav-link">
              <i class="fas fa-chart-bar"></i> Reportes
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/manage-requests" class="nav-link">
              <i class="fas fa-tasks"></i> Gestionar Solicitudes
            </router-link>
          </li>
          <li class="nav-item">
            <button @click="logout" class="nav-link btn btn-link">
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
  data() {
    return {
      isSidebarVisible: false, // Sidebar oculto por defecto
    };
  },
  methods: {
    toggleSidebar() {
      this.isSidebarVisible = !this.isSidebarVisible; // Alternar visibilidad del sidebar
    },
    async logout() {
      await supabase.auth.signOut();
      this.$router.push('/login');
    }
  }
};
</script>
<style>
/* Estilos personalizados para la barra lateral */
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
  transition: transform 0.3s ease;
  z-index: 1000; /* Sidebar tiene z-index alto */
}

.sidebar-hidden {
  transform: translateX(-100%); /* Oculta la barra lateral en pantallas pequeñas */
}

.logo {
  margin-bottom: 40px;
}

.logo h2 {
  color: #fff;
  font-size: 24px;
}

.nav-link {
  display: flex;
  align-items: center;
  color: #fff;
  text-decoration: none;
  font-size: 16px;
  padding: 10px 15px;
  transition: background-color 0.3s;
}

.nav-link i {
  margin-right: 10px;
}

.nav-link:hover {
  background-color: #444;
}

/* Botón de menú */
.menu-btn {
  position: fixed;
  top: 20px;
  left: 20px;
  background-color: #333;
  border: none;
  color: #fff;
  font-size: 24px;
  z-index: 1100; /* El botón tiene un z-index más alto que el sidebar */
  cursor: pointer;
}

/* Responsividad: estilos específicos para pantallas pequeñas */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%); /* Sidebar oculto por defecto */
  }

  .sidebar:not(.sidebar-hidden) {
    transform: translateX(0); /* Muestra el sidebar cuando está visible */
  }

  .menu-btn {
    display: block; /* Mostrar el botón de menú */
    z-index: 1100; /* Asegurarse de que el botón esté por encima del sidebar */
  }
}

</style>