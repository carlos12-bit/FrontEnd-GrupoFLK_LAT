<template>
  <div class="mt-4">
    <h2 class="mb-4 text-center">Lista de Servicios</h2>
    <table id="servicesTable" class="table table-striped table-bordered">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="service in services" :key="service.id">
          <td>{{ service.id }}</td>
          <td>{{ service.nombre }}</td>
          <td>{{ service.descripcion }}</td>
          <td>
            <button class="btn btn-primary btn-sm me-2" @click="editService(service)">Editar</button>
            <button class="btn btn-danger btn-sm" @click="deleteService(service.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modales para Editar y Eliminar -->
    <Edit v-if="selectedService" :service="selectedService" @serviceUpdated="fetchServices" />
    <Delete v-if="serviceToDelete" :serviceId="serviceToDelete" @serviceDeleted="fetchServices" />
  </div>
</template>

<script>
import $ from 'jquery';
import 'datatables.net-bs5'; // Importar DataTables con Bootstrap 5
import Edit from './Edit.vue';
import Delete from './Delete.vue';
import { supabase } from '@/supabase'; // Conectar con Supabase

export default {
  components: {
    Edit,
    Delete,
  },
  data() {
    return {
      services: [], // Lista de servicios
      selectedService: null,
      serviceToDelete: null,
    };
  },
  mounted() {
    this.fetchServices(); // Llamada para obtener los servicios al montar el componente
  },
  watch: {
    services() {
      // Cuando cambian los servicios, reiniciar DataTable
      this.$nextTick(() => {
        $('#servicesTable').DataTable().destroy(); // Destruir la instancia anterior
        this.initDataTable(); // Inicializar DataTable nuevamente
      });
    },
  },
  methods: {
    async fetchServices() {
      // Llamada a Supabase para obtener los servicios
      const { data, error } = await supabase
        .from('tipo_de_inspeccion') // Asegúrate de que este es el nombre correcto de la tabla
        .select('*');

      if (error) {
        console.error('Error al obtener servicios:', error.message);
      } else {
        this.services = data; // Asignar los datos obtenidos a la variable 'services'
        this.initDataTable(); // Inicializar DataTable con los datos obtenidos
      }
    },
    initDataTable() {
      // Inicializar DataTables
      this.$nextTick(() => {
        $('#servicesTable').DataTable({
          paging: true,
          searching: true,
        });
      });
    },
    editService(service) {
      this.selectedService = service; // Establecer el servicio seleccionado para edición
    },
    deleteService(serviceId) {
      this.serviceToDelete = serviceId; // Establecer el ID del servicio que será eliminado
    },
  },
};
</script>

<style scoped>
.table {
  margin-top: 20px;
}

.text-center {
  text-align: center;
}
</style>
