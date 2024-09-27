<template>
 <div class="login-container">
    <form @submit.prevent="handleLogin" class="login-form">
      <h1>Login</h1>
      <div class="form-group">
        <label for="email">Email:</label>
        <input 
          type="email" 
          id="email" 
          v-model="email" 
          required
          :class="{ 'invalid': emailError }"
        >
        <span class="error-message" v-if="emailError">{{ emailError }}</span>
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input 
          type="password" 
          id="password" 
          v-model="password" 
          required
          :class="{ 'invalid': passwordError }"
        >
        <span class="error-message" v-if="passwordError">{{ passwordError }}</span>
      </div>
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Logging in...' : 'Login' }}
      </button>
    </form>
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
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #1a1a1a;
}

.login-form {
  background-color: #000000;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h1 {
  color: #ffffff;
  text-align: center;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #ffffff;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #333333;
  border-radius: 4px;
  background-color: #1a1a1a;
  color: #ffffff;
}

input:focus {
  outline: none;
  border-color: #ff9800;
}

input.invalid {
  border-color: #ff4444;
}

.error-message {
  color: #ff4444;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #ff9800;
  color: #000000;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #ffa726;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.login-form {
  animation: fadeIn 0.5s ease-out;
}
</style>