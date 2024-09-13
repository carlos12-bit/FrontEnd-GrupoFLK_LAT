<template>
  <div class="modal fade show d-block" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Registrar Tipo de Inspección</h5>
          <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitForm">
            <div class="mb-3">
              <label for="nombre" class="form-label">Nombre</label>
              <input type="text" v-model="nombre" class="form-control" id="nombre" required>
            </div>
            <div class="mb-3">
              <label for="descripcion" class="form-label">Descripción</label>
              <textarea v-model="descripcion" class="form-control" id="descripcion" rows="3" required></textarea>
            </div>
            <div class="mb-3">
              <label for="tipo_equipo" class="form-label">Tipo de Equipo</label>
              <select v-model="tipoEquipo" class="form-select" id="tipo_equipo" required>
                <option v-for="tipo in tiposEquipo" :key="tipo.id" :value="tipo.id">{{ tipo.Descripcion }}</option>
              </select>
            </div>
            <button type="submit" class="btn btn-primary">Guardar</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { supabase } from '@/supabase';
import { v4 as uuidv4 } from 'uuid';  // Importamos la función para generar UUID

export default {
  setup(props, { emit }) {
    const nombre = ref('');
    const descripcion = ref('');
    const tipoEquipo = ref(null);  // Estado para el selector de tipo de equipo
    const tiposEquipo = ref([]);  // Estado para almacenar la lista de tipos de equipo

    // Obtener los tipos de equipo desde Supabase
    const fetchTiposEquipo = async () => {
      let { data: tipo_equipo, error } = await supabase
        .from('tipo_equipo')
        .select('*');
      if (!error) {
        tiposEquipo.value = tipo_equipo;
      } else {
        console.error(error);
      }
    };

    // Llamar a la función para obtener los tipos de equipo al montar el componente
    onMounted(fetchTiposEquipo);

    const closeModal = () => {
      emit('close');
    };

    const submitForm = async () => {
      const descripcionRecortada = descripcion.value.slice(0, 255);  // Limitar a 255 caracteres
      const autorUUID = uuidv4();  // Generamos un UUID válido
      
      const { data, error } = await supabase
        .from('tipo_inspeccion')
        .insert([{
          Nombre: nombre.value, 
          descripcion: descripcionRecortada,  // Enviar la descripción recortada
          tipo_equipo_id: tipoEquipo.value,  // Relación con tipo_equipo
          autor: autorUUID,  // UUID generado para el campo 'autor'
          ultimo_autor: autorUUID  // UUID generado para el campo 'ultimo_autor'
        }]);

      if (error) {
        console.error(error);
      } else {
        emit('save');
        closeModal();
      }
    };

    return {
      nombre,
      descripcion,
      tipoEquipo,
      tiposEquipo,
      closeModal,
      submitForm,
    };
  },
};
</script>

<style scoped>
.modal {
  background: rgba(0, 0, 0, 0.5);
}

/* Colores de campos */
.form-label,
#nombre,
#descripcion {
  color: black;
}

input.form-control,
textarea.form-control {
  color: black;
}
</style>
