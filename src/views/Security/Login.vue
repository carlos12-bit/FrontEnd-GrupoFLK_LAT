<template>
  <div class="login-container">
    <form @submit.prevent="handleLogin" class="login-form">
      <h1>Login</h1>
      <div class="form-group">
        <label for="email">Email:</label>
        <input 
          type="email" 
          v-model="email" 
          required 
          placeholder="Ingresa tu email"
        />
      </div>
      <div class="form-group">
        <label for="password">Contraseña:</label>
        <input 
          type="password" 
          v-model="password" 
          required 
          placeholder="Ingresa tu contraseña"
        />
      </div>
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Iniciando sesión...' : 'Login' }}
      </button>
      <p v-if="error" class="error-message">{{ error }}</p>
    </form>
  </div>
</template>

<script>
import { login } from '../../auth'; // Importar la función login desde auth.js

export default {
  data() {
    return {
      email: '',
      password: '',
      isLoading: false,
      error: null,
    };
  },
  methods: {
    async handleLogin() {
      this.isLoading = true;
      this.error = null;

      try {
        // Llamar a la función de login
        const { user, rolId, jwt } = await login(this.email, this.password);

        // Guardar el usuario y el JWT en localStorage
        localStorage.setItem('user', JSON.stringify(user)); // Esto ya se hace en la función login
        localStorage.setItem('jwt', jwt); // El JWT también ya se guarda en la función

        // Redirigir al dashboard correspondiente según el rol del usuario
        switch (rolId) {
          case 1: // Nuevo
            this.$router.push('/home');
            break;
          case 2: // Asistente de Operaciones
            this.$router.push('/operations-assistant-dashboard');
            break;
          case 3: // Administrador
            this.$router.push('/admin-dashboard');
            break;
          case 4: // Recepcionista
            this.$router.push('/receptionist-dashboard');
            break;
          case 5: // Operador
            this.$router.push('/operator-dashboard');
            break;
          case 6: // Instructor
            this.$router.push('/instructor-dashboard');
            break;
          case 7: // Formador
            this.$router.push('/formador-dashboard');
            break;
          default:
            this.error = 'No se ha asignado un rol válido a este usuario.';
        }

      } catch (error) {
        this.error = error.message;
        console.error('Error de login:', error);
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>
<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.login-form {
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #007bff;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
}

.error-message {
  color: red;
  text-align: center;
  margin-top: 1rem;
}
</style>