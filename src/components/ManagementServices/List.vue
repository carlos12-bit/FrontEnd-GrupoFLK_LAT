<template>
  <div class="container mt-4">
    <button class="btn btn-primary mb-4" @click="showCreateForm">Crear Nuevo</button>

    <table id="datatable" class="table table-striped table-bordered" style="width:100%">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Fecha de Creación</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in tipoDeInspeccion" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.nombre }}</td>
          <td>{{ item.descripcion }}</td>
          <td>{{ item.fecha_de_creacion }}</td>
          <td>
            <button class="btn btn-sm btn-info">Editar</button>
            <button class="btn btn-sm btn-danger" @click="deleteItem(item.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { supabase } from '@/supabase';  // Corrigiendo la referencia a supabase
import $ from 'jquery';                 // Importando jQuery
import 'datatables.net-bs5';            // Importando DataTables con Bootstrap 5

export default {
  props: ['showCreateForm'],
  setup(props) {
    const tipoDeInspeccion = ref([]);

    const fetchData = async () => {
      let { data, error } = await supabase
        .from('tipo_de_inspeccion')
        .select('*');
      
      if (error) {
        console.error(error);
      } else {
        tipoDeInspeccion.value = data;

        // Inicializar DataTable después de cargar los datos
        $(document).ready(function () {
          $('#datatable').DataTable();
        });
      }
    };

    const deleteItem = async (id) => {
      const { error } = await supabase
        .from('tipo_de_inspeccion')
        .delete()
        .eq('id', id);
      if (!error) {
        fetchData(); // Refrescar la lista después de eliminar
      }
    };

    onMounted(() => {
      fetchData();
    });

    return {
      tipoDeInspeccion,
      deleteItem,
    };
  },
};
</script>

<style scoped>
/* Aquí puedes agregar estilos adicionales si es necesario */
</style>
