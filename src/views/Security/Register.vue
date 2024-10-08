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
        <select class="form-control" v-model="selectedRol" required>
          <option value="">Elige un rol</option>
          <option v-for="rol in roles" :key="rol.id" :value="rol.id">{{ rol.nombre }}</option>
        </select>
      </div>
      <button type="submit" class="btn btn-primary">Registrar</button>
    </form>
    <p v-if="error" class="text-danger">{{ error }}</p>
    <p v-if="message" class="text-success">{{ message }}</p>
  </div>
</template>

<script>
import { supabase } from '../../supabase.js'; // Asegúrate de que la ruta sea correcta
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const email = ref('');
    const password = ref('');
    const selectedRol = ref('');
    const roles = ref([]);
    const error = ref(null);
    const message = ref(null);

    // Obtener roles desde la base de datos
    const fetchRoles = async () => {
      const { data, error: rolesError } = await supabase
        .from('roles')
        .select('*');
      if (rolesError) {
        error.value = 'Error al cargar los roles';
      } else {
        roles.value = data;
      }
    };

    // Llamar a la función de carga de roles cuando el componente se monta
    onMounted(() => {
      fetchRoles();
    });

    // Función para manejar el registro
    const handleRegister = async () => {
      error.value = null;
      message.value = null;

      try {
        // Crear el usuario en Supabase
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: email.value,
          password: password.value,
        });

        if (signUpError) throw signUpError;

        const user = signUpData.user;

        // Asegurarse de que el usuario fue creado correctamente
        if (user) {
          // Insertar en la tabla 'AsignacionDeUsuario' usando el UUID del usuario creado
          const { error: insertError } = await supabase
            .from('asignaciondeusuario') // Nombre correcto de la tabla
            .insert([
              { id: user.id, rol: selectedRol.value }, // Insertamos el UUID del usuario y el rol
            ]);

          if (insertError) throw insertError;

          // Registro exitoso
          message.value = 'Registro exitoso. Por favor revisa tu email para confirmar.';
        }
      } catch (err) {
        error.value = err.message || 'Error en el proceso de registro.';
      }
    };

    return {
      email,
      password,
      selectedRol,
      roles,
      error,
      message,
      handleRegister,
    };
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