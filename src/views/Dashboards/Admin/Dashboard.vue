<template>
  <div class="dashboard-container">
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
            <button @click="logout" class="nav-link logout-btn">
              <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
            </button>
          </li>
        </ul>
      </nav>
    </div>

    <!-- Main Content -->
    <div class="dashboard">
      <h1>Hola, Administrador</h1>
      <button @click="logout" class="btn btn-primary">Cerrar Sesión</button>
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
}

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

.dashboard {
  margin-left: 250px; /* Añadido margen para no solaparse con el sidebar */
  padding: 20px;
  text-align: center;
  width: 100%;
}

.btn-primary {
  background-color: #BF5630;
  border-color: #BF5630;
}

.btn-primary:hover {
  background-color: #8C2F1B;
  border-color: #8C2F1B;
}
</style>

  