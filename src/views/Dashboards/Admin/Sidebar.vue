<template>
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
        <!-- Nueva opción para gestionar solicitudes -->
        <li>
          <router-link to="/manage-requests" class="nav-link">
            <i class="fas fa-tasks"></i> Gestionar Solicitudes
          </router-link>
        </li>
        <!-- Nueva opción para gestionar cursos -->
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
/* El estilo permanece igual que el original */
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
</style>
