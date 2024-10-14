<template>
  <div>
    <!-- Contenedor de la tabla con DataTables -->
    <table id="machinery-table" class="display" style="width:100%">
      <thead>
        <tr>
          <th>Descripción</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(maquinaria, index) in maquinarias" :key="index">
          <td>{{ maquinaria.descripcion }}</td>
          <td>
            <button class="btn btn-primary" @click="handleEdit(maquinaria)">Editar</button>
            <button class="btn btn-danger" @click="handleDelete(maquinaria)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import 'datatables.net-dt/css/dataTables.dataTables.min.css'; // Importar los estilos de DataTables
import { supabase } from '@/supabase';
import $ from 'jquery';
import 'datatables.net'; // Importar DataTables

const maquinarias = ref([]); // Datos obtenidos de Supabase

// Función para obtener los datos de maquinaria desde Supabase
async function fetchMachineries() {
  const { data, error } = await supabase
    .from('tipo_de_maquinaria')
    .select('*');

  if (error) {
    console.error('Error al obtener tipos de maquinaria:', error);
  } else {
    maquinarias.value = data;
    initializeDataTable(); // Inicializar DataTable después de cargar los datos
  }
}

// Función para inicializar DataTables
function initializeDataTable() {
  $(document).ready(function () {
    $('#machinery-table').DataTable({
      searching: true,  // Barra de búsqueda
      paging: true,     // Paginación
      info: true,       // Mostrar información de cantidad de registros
      responsive: true, // Hacer la tabla responsiva
      autoWidth: false,
      language: {
        search: "Buscar:",
        lengthMenu: "Mostrar _MENU_ registros",
        info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
        paginate: {
          first: "Primero",
          last: "Último",
          next: "Siguiente",
          previous: "Anterior",
        },
      },
    });
  });
}

// Funciones para Editar y Eliminar maquinaria
function handleEdit(maquinaria) {
  alert(`Editar maquinaria: ${maquinaria.descripcion}`);
}

function handleDelete(maquinaria) {
  alert(`Eliminar maquinaria: ${maquinaria.descripcion}`);
}

// Ejecutar la carga de datos al montar el componente
onMounted(() => {
  fetchMachineries();
});
</script>

<style scoped>
/* Estilos para los botones */
.btn {
  margin-right: 5px;
  padding: 5px 10px;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

/* Estilo para hacer la tabla más atractiva */
#machinery-table {
  width: 100%;
  border-collapse: collapse;
}

#machinery-table th, #machinery-table td {
  padding: 10px;
  text-align: left;
}
</style>
