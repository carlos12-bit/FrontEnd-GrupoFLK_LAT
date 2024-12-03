<template>
<section class="vh-100" @submit.prevent="handleLogin" >
  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-6 text-black">

        <div class="px-5 ms-xl-4">
          <i class="fas fa-crow fa-2x me-3 pt-5 mt-xl-4" style="color: #709085;"></i>
          <span class="h1 fw-bold mb-0">GRUPO FLK</span>
        </div>

        <div class="d-flex align-items-center h-custom-2 px-5 ms-xl-4 mt-5 pt-5 pt-xl-0 mt-xl-n5">

          <form style="width: 23rem;">

            <h3 class="fw-normal mb-3 pb-3" style="letter-spacing: 1px;">Iniciar Sesion</h3>

            <div data-mdb-input-init class="form-outline mb-4">
              <input v-model="email" type="email" id="form2Example18" required class="form-control form-control-lg" />
              <label class="form-label" for="form2Example18">Correo</label>
            </div>

            <div data-mdb-input-init class="form-outline mb-4">
              <input v-model="password" type="password" id="form2Example28" required class="form-control form-control-lg" />
              <label class="form-label" for="form2Example28">Contraseña</label>
            </div>

            <div class="pt-1 mb-4">
              <button data-mdb-button-init data-mdb-ripple-init class="btn btn-info btn-lg btn-block" type="submit" :disabled="isLoading" >ingresar</button>
            </div>

            <p class="small mb-5 pb-lg-2"><a class="text-muted" href="/ResetPassword">Forgot password?</a></p>
            <p>Don't have an account? <a href="/register" class="link-info">Register here</a></p>

          </form>

        </div>

      </div>
      <div class="col-sm-6 px-0 d-none d-sm-block">
        <img src="../../assets/Portada.png"
          alt="Login image" class="w-100 vh-100" style="object-fit: cover; object-position: left;">
      </div>
    </div>
  </div>
</section>
</template>

<script>
import { login,GetUser  } from '@/auth'; // Importar la función login desde auth.js

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

        const userId = GetUser(); // Obtener el ID del usuario logueado

        console.log("ID del usuario:", userId); // Verifica el I
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