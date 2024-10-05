<template>
  <div class="card mb-4">
    <div class="card-header">
      <h5 class="card-title">Editar Servicio</h5>
    </div>
    <div class="card-body">
      <form @submit.prevent="updateService">
        <!-- Campo para editar el nombre del servicio -->
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

        <!-- Campo para editar la descripción del servicio -->
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

        <!-- Campo de selección para editar el tipo de maquinaria -->
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

        <button type="submit" class="btn btn-primary w-100">Actualizar</button>
        <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
        <div v-if="successMessage" class="alert alert-success mt-3">{{ successMessage }}</div>
      </form>
    </div>
  </div>
</template>

<script>
import { supabase } from '@/supabase'; // Asegúrate de que la ruta sea correcta

export default {
  props: {
    serviceId: Number,  // Recibe el ID del servicio a editar
  },
  data() {
    return {
      Nombre: '',
      Descripcion: '',
      tipoDeMaquinariaSeleccionada: '',
      tiposDeMaquinaria: [], // Lista de tipos de maquinaria
      errorMessage: null, // Para manejar mensajes de error
      successMessage: null, // Para manejar mensajes de éxito
      nombreError: false, // Para manejar errores de validación del campo 'nombre'
    };
  },
  async mounted() {
    await this.fetchServiceData(); // Cargar los datos del servicio
    await this.fetchTiposDeMaquinaria(); // Cargar los tipos de maquinaria disponibles
  },
  methods: {
    // Cargar los datos del servicio existente
    async fetchServiceData() {
      try {
        const { data, error } = await supabase
          .from('tipo_de_inspeccion')
          .select('nombre, descripcion, tipo_de_maquinaria_id')
          .eq('id', this.serviceId)
          .single();

        if (error) {
          this.errorMessage = 'Error al obtener los datos del servicio: ' + error.message;
          console.error('Error al obtener los datos del servicio:', error.message);
        } else {
          // Asignar los datos obtenidos a las variables del formulario
          this.Nombre = data.nombre;
          this.Descripcion = data.descripcion;
          this.tipoDeMaquinariaSeleccionada = data.tipo_de_maquinaria_id;
        }
      } catch (error) {
        this.errorMessage = 'Error inesperado al cargar los datos del servicio.';
        console.error('Error inesperado al cargar los datos del servicio:', error);
      }
    },

    // Cargar los tipos de maquinaria
    async fetchTiposDeMaquinaria() {
      try {
        const { data: tiposDeMaquinaria, error } = await supabase
          .from('Tipo_De_Maquinaria')
          .select('id, Descripcion');

        if (error) {
          this.errorMessage = 'Error al cargar los tipos de maquinaria: ' + error.message;
          console.error('Error al cargar los tipos de maquinaria:', error.message);
        } else {
          this.tiposDeMaquinaria = tiposDeMaquinaria;
        }
      } catch (error) {
        this.errorMessage = 'Error inesperado al cargar los tipos de maquinaria.';
        console.error('Error inesperado al cargar los tipos de maquinaria:', error);
      }
    },

    // Validación del campo 'nombre'
    validarNombre() {
      const regex = /^[A-Za-z ]+$/;
      return regex.test(this.Nombre);
    },

    // Actualizar los datos del servicio
    async updateService() {
      // Restablecer mensajes
      this.errorMessage = null;
      this.successMessage = null;
      this.nombreError = false;

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
        // Actualizar el servicio en la base de datos
        const { error } = await supabase
          .from('tipo_de_inspeccion')
          .update({
            nombre: this.Nombre,
            descripcion: this.Descripcion,
            tipo_de_maquinaria_id: this.tipoDeMaquinariaSeleccionada,
          })
          .eq('id', this.serviceId);

        if (error) {
          this.errorMessage = 'Error al actualizar el servicio: ' + error.message;
          console.error('Error al actualizar el servicio:', error.message);
        } else {
          this.successMessage = 'Servicio actualizado exitosamente.';
        }
      } catch (error) {
        this.errorMessage = 'Ocurrió un error inesperado al actualizar el servicio.';
        console.error('Error inesperado al actualizar el servicio:', error);
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
