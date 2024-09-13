<template>
  <div class="container mt-5">
    <h3>Tipos de Inspección</h3>
    <table id="inspection-types-table" class="table table-striped table-bordered dt-responsive nowrap" style="width:100%">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Fecha de creación</th>
          <th>Fecha de modificación</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="tipo in tiposInspeccion" :key="tipo.id">
          <td>{{ tipo.id }}</td>
          <td>{{ tipo.Nombre }}</td>
          <td>{{ tipo.descripcion }}</td>
          <td>{{ new Date(tipo.fecha_de_creacion).toLocaleDateString() }}</td>
          <td>{{ new Date(tipo.fecha_de_modificacion).toLocaleDateString() }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { supabase } from '@/supabase'; // Asegúrate de importar tu cliente de Supabase
import 'datatables.net-bs5';
import 'datatables.net-responsive-bs5';

export default {
  setup() {
    const tiposInspeccion = ref([]);

    const fetchTiposInspeccion = async () => {
      let { data: tipo_inspeccion, error } = await supabase
        .from('tipo_inspeccion')
        .select('*');
      
      if (!error) {
        tiposInspeccion.value = tipo_inspeccion;
      } else {
        console.error(error);
      }
    };

    onMounted(async () => {
      await fetchTiposInspeccion();

      // Inicializa DataTables después de que los datos sean cargados
      $(document).ready(function() {
        $('#inspection-types-table').DataTable();
      });
    });

    return {
      tiposInspeccion
    };
  }
};
</script>

<style>
/* Estilo opcional para mejorar el aspecto de la tabla */
.table {
  width: 100%;
}
</style>