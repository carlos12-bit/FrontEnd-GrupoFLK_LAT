<template>
    <div class="login container my-5">
      <h2>Iniciar Sesión</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input type="email" class="form-control" id="email" v-model="email" placeholder="Tu email" required>
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Contraseña</label>
          <input type="password" class="form-control" id="password" v-model="password" placeholder="Tu contraseña" required>
        </div>
        <button type="submit" class="btn btn-primary">Ingresar</button>
      </form>
      <p v-if="error" class="text-danger">{{ error }}</p>
    </div>
  </template>
  
  <script>
  import { supabase } from '../supabase';
  
  export default {
    name: 'Login',
    data() {
      return {
        email: '',
        password: '',
        error: null,
      };
    },
    methods: {
      async handleLogin() {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: this.email,
          password: this.password,
        });
  
        if (error) {
          this.error = 'Error al iniciar sesión: ' + error.message;
        } else {
          this.error = null;
          // Redirigir al usuario o manejar el inicio de sesión exitoso
          this.$router.push('/dashboard'); // Cambia "/dashboard" a la ruta que desees
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .container {
    color: #BF5630;
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
  