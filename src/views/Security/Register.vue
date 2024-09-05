<template>
  <div class="register container my-5">
    <h2>Registrar</h2>
    <form @submit.prevent="handleRegister">
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input
          type="email"
          class="form-control"
          id="email"
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
          id="password"
          v-model="password"
          placeholder="Tu contraseña"
          required
        />
      </div>
      <div class="mb-3">
        <label for="rol" class="form-label">Selecciona tu rol</label>
        <select class="form-control" v-model="rol" required>
          <option value="">Elige un rol</option>
          <option value="Administrador">Administrador</option>
          <option value="Recepcionista">Recepcionista</option>
          <option value="Asistente de Operaciones">Asistente de Operaciones</option>
        </select>
      </div>
      <button type="submit" class="btn btn-primary">Registrar</button>
    </form>
    <p v-if="error" class="text-danger">{{ error }}</p>
  </div>
</template>

<script>
import { supabase } from '../../supabase.js'; // Asegúrate de que la ruta sea correcta

export default {
  name: 'Register',
  data() {
    return {
      email: '',
      password: '',
      rol: '', // Se añadirá el rol aquí
      error: null,
    };
  },
  methods: {
    async handleRegister() {
      // Verificar que el usuario haya seleccionado un rol
      if (!this.rol) {
        this.error = 'Por favor, selecciona un rol.';
        return;
      }

      try {
        // Insertar el usuario directamente en la tabla profiles
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              email: this.email,
              password: this.password, // La contraseña ahora se guarda en la tabla profiles
              rol: this.rol,
            },
          ]);

        if (profileError) {
          this.error = 'Error al registrar: ' + profileError.message;
        } else {
          this.error = null;
          // Redirigir al usuario después de un registro exitoso
          this.$router.push('/login');
        }
      } catch (error) {
        console.error("Error durante el registro:", error);
        this.error = "Ocurrió un error inesperado. Inténtalo nuevamente.";
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
