<template>
  <div class="container mt-5">
    <button class="btn btn-primary" @click="createTipoInspeccion">Crear Tipo de Inspección</button>
    <table class="table table-striped">
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Nombre</th>
          <th scope="col">Descripción</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="inspeccion in tipo_de_inspeccion" :key="inspeccion.id">
          <td>{{ inspeccion.id }}</td>
          <td>{{ inspeccion.nombre }}</td>
          <td>{{ inspeccion.descripcion }}</td>
        </tr>
      </tbody>
    </table>
    <CreateService v-if="showCreateService" @close="showCreateService = false" />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { supabase } from '../../supabase';
import CreateService from '@/components/ManagementeGeneral/CreateService.vue';

export default {
  components: {
    CreateService
  },
  setup() {
    const tipo_de_inspeccion = ref([]);
    const showCreateService = ref(false);

    onMounted(async () => {
      let { data, error } = await supabase
        .from('tipo_de_inspeccion')
        .select('*');
      if (error) {
        console.error(error);
      } else {
        tipo_de_inspeccion.value = data;
      }
    });

    const createTipoInspeccion = () => {
      showCreateService.value = true;
    };

    return {
      tipo_de_inspeccion,
      showCreateService,
      createTipoInspeccion
    };
  }
};
</script>

<style>
@import 'https://stackpath.bootstrapcdn.com/bootstrap/5.0.0/css/bootstrap.min.css';
</style>