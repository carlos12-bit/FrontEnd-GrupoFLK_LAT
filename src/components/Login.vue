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
      <div>
        <button type="submit" class="btn btn-primary">Ingresar</button>
        <router-link to="/Register">
          <button type="button" class="btn btn-warning">Registrarse</button>
        </router-link>
      </div>
    </form>
    <p v-if="error" class="text-danger">{{ error }}</p>
  </div>
</template>

<script>
import { supabase } from '../supabase'; // Asegúrate de que la ruta sea correcta

export default {
  data() {
    return {
      email: '',
      password: '',
      error: null,
    };
  },
  methods: {
    async handleLogin() {
      // Inicia sesión
      const { data: session, error: authError } = await supabase.auth.signInWithPassword({
        email: this.email,
        password: this.password,
      });

      if (authError) {
        this.error = authError.message;
        return;
      }

      if (session) {
        // Obtén el ID del usuario autenticado
        const userId = session.user.id;

        // Consulta el rol del usuario desde la tabla 'profiles'
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('rol')
          .eq('id', userId)
          .single();

        if (profileError) {
          this.error = profileError.message;
          return;
        }

        // Muestra el rol en la consola
        console.log('User Role:', profile.rol);

        // Redirige al dashboard
        this.$router.push('/dashboard');
      }
    },
  },
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
