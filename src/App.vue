<template>
  <div>
    <router-view />
  </div>
</template>

<script>
import { getSession } from './auth'; // Importar la función para obtener la sesión

export default {
  async mounted() {
    try {
      const session = await getSession();
      if (!session) {
        this.$router.push('/login'); // Si no hay sesión, redirigir a la página de login
      } else {
        // Si hay sesión, guardar la sesión en el estado o en el localStorage
        localStorage.setItem('session', JSON.stringify(session));
      }
    } catch (error) {
      console.error('Error al obtener la sesión:', error);
      this.$router.push('/login'); // En caso de error, redirigir al login
    }
  }
}
</script>

