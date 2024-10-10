<template>
    <div class="dashboard-container">
      <!-- Sidebar -->
      <Sidebar /> <!-- Componente Sidebar para reutilizar -->
      
      <!-- Main Content -->
      <div class="dashboard">
        <h1>Hola, Operador</h1>
        <button @click="logout" class="btn btn-primary">Cerrar Sesión</button>
      </div>
    </div>
  </template>
  <script>
  import { supabase } from '@/supabase.js';
  import Sidebar from '@/views/Dashboards/Operator/Sidebar.vue'; // Importa el sidebar si es un componente separado
  
  export default {
    components: {
      Sidebar,
    },
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
  