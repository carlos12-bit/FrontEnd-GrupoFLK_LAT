<template>
    <div class="dashboard">
      <h1>Hola, Recepcionista</h1>
      <button @click="logout" class="btn btn-primary">Cerrar Sesión</button>
    </div>
  </template>
  
  <script>
  import { supabase } from '@/supabase.js'; // Asegúrate de que la ruta sea correcta
  
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
  .dashboard {
    text-align: center;
    margin-top: 50px;
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
  