<template>
  <div class="overlay">
    <div class="card">
      <div class="card-header">
        Crear Nuevo Tipo de Inspección
        <button type="button" class="btn-close" aria-label="Close" @click="closeCreateForm"></button>
      </div>
      <div class="card-body">
        <form @submit.prevent="createItem">
          <div class="mb-3">
            <label for="nombre" class="form-label">Nombre</label>
            <input type="text" v-model="nombre" class="form-control" id="nombre" required />
          </div>
          <div class="mb-3">
            <label for="descripcion" class="form-label">Descripción</label>
            <textarea v-model="descripcion" class="form-control" id="descripcion" required></textarea>
          </div>
          <button type="submit" class="btn btn-primary">Guardar</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { supabase } from '@/supabase';

export default {
  emits: ['refreshData', 'closeCreateForm'],
  setup(props, { emit }) {
    const nombre = ref('');
    const descripcion = ref('');

    const createItem = async () => {
      const { error } = await supabase
        .from('tipo_de_inspeccion')
        .insert({ nombre: nombre.value, descripcion: descripcion.value });
      
      if (!error) {
        emit('refreshData');
        emit('closeCreateForm');
      }
    };

    const closeCreateForm = () => {
      emit('closeCreateForm');
    };

    return {
      nombre,
      descripcion,
      createItem,
      closeCreateForm,
    };
  },
};
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.card {
  width: 400px;
}

.btn-close {
  float: right;
}
</style>
