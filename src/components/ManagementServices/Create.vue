<template>
  <div class="card mb-4">
    <div class="card-header">
      <h5 class="card-title">Crear Nuevo Servicio</h5>
    </div>
    <div class="card-body">
      <form @submit.prevent="createService">
        <div class="mb-3">
          <label for="Nombre" class="form-label">Nombre</label>
          <input 
            type="text" 
            class="form-control" 
            v-model="Nombre" 
            required 
            placeholder="Ingrese el nombre del servicio"
            :class="{ 'is-invalid': nombreError }"
          />
          <div v-if="nombreError" class="invalid-feedback">
            El nombre solo puede contener letras y espacios.
          </div>
        </div>
        <div class="mb-3">
          <label for="Descripcion" class="form-label">Descripción</label>
          <textarea 
            class="form-control" 
            v-model="Descripcion" 
            rows="3" 
            required 
            placeholder="Ingrese la descripción del servicio"
          ></textarea>
        </div>

        <!-- Campo de selección para tipo de maquinaria -->
        <div class="mb-3">
          <label for="TipoDeMaquinaria" class="form-label">Tipo de Maquinaria</label>
          <select 
            class="form-select" 
            v-model="tipoDeMaquinariaSeleccionada" 
            required
          >
            <option disabled value="">Seleccione un tipo de maquinaria</option>
            <option v-for="tipo in tiposDeMaquinaria" :key="tipo.id" :value="tipo.id">
              {{ tipo.Descripcion }}
            </option>
          </select>
        </div>

        <button type="submit" class="btn btn-success w-100">Crear</button>
        <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
        <div v-if="successMessage" class="alert alert-success mt-3">{{ successMessage }}</div>
      </form>
    </div>
  </div>
</template>

<script>
import { supabase } from '@/supabase'; // Asegúrate de que la ruta sea correcta

export default {
  data() {
    return {
      Nombre: '',
      Descripcion: '',
      tipoDeMaquinariaSeleccionada: '', // Para almacenar el ID seleccionado del tipo de maquinaria
      tiposDeMaquinaria: [], // Lista de tipos de maquinaria obtenidos de la base de datos
      user: null, // Para almacenar el usuario autenticado
      errorMessage: null, // Para manejar mensajes de error
      successMessage: null, // Para manejar mensajes de éxito
      nombreError: false,  // Para manejar errores de validación del campo 'nombre'
    };
  },
  async mounted() {
  try {
    // Obtener la sesión actual
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error al obtener la sesión del usuario:', error.message);
      this.errorMessage = 'Error al obtener la sesión del usuario';
      return;
    }

    if (session && session.user) {
      this.user = session.user;
    } else {
      console.error('No hay sesión de usuario activa');
      this.errorMessage = 'No hay sesión de usuario activa';
    }

    // Obtener los tipos de maquinaria de la base de datos
    const { data: tiposDeMaquinaria, error: maquinariaError } = await supabase
      .from('tipo_de_maquinaria')
      .select('*');
    
    if (maquinariaError) {
      console.error('Error al obtener los tipos de maquinaria:', maquinariaError.message);
      this.errorMessage = 'Error al cargar los tipos de maquinaria.';
      return;
    }

    this.tiposDeMaquinaria = tiposDeMaquinaria;
  } catch (error) {
    console.error('Error al obtener los datos del usuario o tipos de maquinaria:', error.message);
    this.errorMessage = 'Error al inicializar el formulario.';
  }
},

  methods: {
    // Validación de nombre
    validarNombre() {
      const regex = /^[A-Za-z ]+$/;
      return regex.test(this.Nombre);
    },
    async createService() {
      // Restablecer mensajes
      this.errorMessage = null;
      this.successMessage = null;
      this.nombreError = false;

      // Verificar si el usuario está autenticado
      if (!this.user) {
        this.errorMessage = 'No se ha encontrado un usuario autenticado.';
        return;
      }

      // Validar el campo 'nombre'
      if (!this.validarNombre()) {
        this.nombreError = true;
        this.errorMessage = 'El nombre solo puede contener letras y espacios.';
        return;
      }

      // Verificar si se ha seleccionado un tipo de maquinaria
      if (!this.tipoDeMaquinariaSeleccionada) {
        this.errorMessage = 'Debe seleccionar un tipo de maquinaria.';
        return;
      }

      try {
        // Inserción del nuevo servicio
        const { error } = await supabase
          .from('tipo_de_inspeccion')
          .insert([{
            nombre: this.Nombre,
            descripcion: this.Descripcion,
            tipo_de_maquinaria_id: this.tipoDeMaquinariaSeleccionada, // ID del tipo de maquinaria seleccionado
            autor: this.user.id, // ID del usuario autenticado
            ultimo_autor: this.user.id, // ID del usuario autenticado
          }]);

        if (error) {
          this.errorMessage = 'Error al crear el servicio: ' + error.message;
          console.error('Error al crear el servicio:', error.message);
        } else {
          this.successMessage = 'Servicio creado exitosamente.';
          // Limpiar los campos
          this.Nombre = '';
          this.Descripcion = '';
          this.tipoDeMaquinariaSeleccionada = '';
        }
      } catch (error) {
        this.errorMessage = 'Ocurrió un error inesperado al crear el servicio.';
        console.error('Error inesperado:', error);
      }
    },
  },
};
</script>

<style scoped>
.card {
  margin-top: 20px;
}

.card-title {
  text-align: center;
}

.btn {
  margin-top: 10px;
}

.alert {
  text-align: center;
}

.is-invalid {
  border-color: #dc3545;
}

.invalid-feedback {
  color: #dc3545;
}
</style>
