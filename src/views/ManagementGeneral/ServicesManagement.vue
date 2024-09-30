<template>
  <div class="container mt-5">
    <button class="btn btn-primary" @click="createTipoInspeccion">Crear Tipo de Inspección</button>
    <table class="table table-striped">
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Nombre</th>
          <th scope="col">Descripción</th>
          <th scope="col">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="inspeccion in tipo_de_inspeccion" :key="inspeccion.id">
          <td>{{ inspeccion.id }}</td>
          <td>{{ inspeccion.nombre }}</td>
          <td>{{ inspeccion.descripcion }}</td>
          <td>
            <button class="btn btn-warning" @click="EditService" >Editar</button>
            <button class="btn btn-danger">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
    <SeleccionarServicio
      v-if="showModal"
      @close="showModal = false"
      @serviceSelected="handleServiceSelected"
    />

  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { supabase } from '../../supabase';
import CreateService from '@/components/ManagementeGeneral/CreateService.vue';
import EditService from '@/components/ManagementeGeneral/EdistService.vue';

export default {
  components: {
    CreateService,
    EditService
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
      createTipoInspeccion,
      EditService
    };
  }
};
</script>

<style>
@import 'https://stackpath.bootstrapcdn.com/bootstrap/5.0.0/css/bootstrap.min.css';
</style>