<template>
  <div class="register container my-5">
    <h2>Registrar</h2>
    <form @submit.prevent="handleRegister">
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input type="email" class="form-control" id="email" v-model="email" placeholder="Tu email" required>
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Contraseña</label>
        <input type="password" class="form-control" id="password" v-model="password" placeholder="Tu contraseña" required>
      </div>
      <button type="submit" class="btn btn-primary">Registrar</button>
    </form>
    <p v-if="error" class="text-danger">{{ error }}</p>
  </div>
</template>

<script>
import { supabase } from '../supabase';

export default {
  name: 'Register',
  data() {
    return {
      email: '',
      password: '',
      error: null,
    };
  },
  methods: {
    async handleRegister() {
      const { data, error } = await supabase.auth.signUp({
        email: this.email,
        password: this.password,
      });

      if (error) {
        this.error = 'Error al registrar: ' + error.message;
      } else {
        this.error = null;
        // Redirigir al usuario o manejar el registro exitoso
        this.$router.push('/login'); // Cambia "/login" a la ruta que desees
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
