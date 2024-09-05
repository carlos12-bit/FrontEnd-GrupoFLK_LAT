<template>
  <div class="login container my-5">
    <h2>Iniciar Sesión</h2>
    <form @submit.prevent="handleLogin">
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input
          type="email"
          class="form-control"
          v-model="email"
          placeholder="Tu email"
          required
        />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Contraseña</label>
        <input
          type="password"
          class="form-control"
          v-model="password"
          placeholder="Tu contraseña"
          required
        />
      </div>
      <button type="submit" class="btn btn-primary">Ingresar</button>
    </form>
    <p v-if="error" class="text-danger">{{ error }}</p>
  </div>
</template>
<script>
import { supabase } from '../../supabase.js'; // Asegúrate de que la ruta sea correcta

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
      try {
        console.log("Intentando iniciar sesión con el correo:", this.email);
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id, email, password, rol')
          .eq('email', this.email)
          .single();

        if (profileError || !profile) {
          this.error = 'Correo electrónico no encontrado o error al obtener el perfil.';
          console.error('Error al obtener el perfil:', profileError);
          return;
        }

        console.log("Perfil encontrado:", profile);

        // Verificar la contraseña
        if (profile.password !== this.password) {
          this.error = 'Contraseña incorrecta.';
          console.log("Contraseña incorrecta ingresada");
          return;
        }

        console.log("Contraseña correcta, rol del usuario:", profile.rol);

        // Almacenar el perfil del usuario en localStorage
        localStorage.setItem('user', JSON.stringify(profile));

        // Redirigir según el rol del usuario
        if (profile.rol === 'Administrador') {
          this.$router.push('/admin-dashboard');
        } else if (profile.rol === 'Recepcionista') {
          this.$router.push('/receptionist-dashboard');
        } else if (profile.rol === 'Asistente de Operaciones') {
          this.$router.push('/operations-assistant-dashboard');
        } else {
          this.error = 'Acceso no permitido para este rol.';
          console.log("Rol no permitido:", profile.rol);
        }
      } catch (error) {
        console.error('Error durante el proceso de login:', error);
        this.error = 'Ocurrió un error inesperado. Inténtalo nuevamente.';
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
