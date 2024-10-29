<template>
  <div class="data-table-container">
    <h2 class="text-center mb-4">Servicios De Inspección</h2>
    <div class="button-group mb-3">
      <button class="btn btn-primary" @click="openRegisterModal">Registrar Servicio</button>
      <button class="btn btn-success mx-3" @click="exportToExcel">Exportar a Excel</button>
    </div>

    <!-- Barra de búsqueda -->
    <el-input
      placeholder="Buscar por servicio o maquinaria"
      v-model="searchQuery"
      class="mb-3 search-input"
    />

    <!-- Tabla de datos -->
    <el-table :data="paginatedServicios" style="width: 100%" border>
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column
        prop="servicio"
        label="Servicio"
        sortable
        :sort-method="(a, b) => a.servicio.localeCompare(b.servicio)"
      />
      <el-table-column
        prop="maquinaria"
        label="Maquinaria"
        sortable
        :sort-method="(a, b) => a.maquinaria.localeCompare(b.maquinaria)"
      />

      <!-- Columna de acciones -->
      <el-table-column label="Acciones" width="150">
        <template #default="scope">
          <el-button size="mini" type="primary" @click="editService(scope.row)">Editar</el-button>
          <el-button size="mini" type="danger" @click="deleteService(scope.row)">Eliminar</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Contenedor de paginación -->
    <div class="pagination-container">
      <div class="empty-column"></div>
      <el-pagination
        @current-change="handlePageChange"
        :current-page="currentPage"
        :page-size="itemsPerPage"
        :total="filteredServicios.length"
        layout="total, prev, pager, next"
        class="pagination"
      />
      <div class="select-with-message mt-1">
        <span class="page-size-message">Mostrar</span>
        <el-select v-model="itemsPerPage" class="page-size-select" placeholder="Items por página">
          <el-option label="5" :value="5" />
          <el-option label="10" :value="10" />
          <el-option label="15" :value="15" />
          <el-option label="20" :value="20" />
        </el-select>
        <span class="page-size-message">registros</span>
      </div>
    </div>
  </div>
      <!-- Modal para Registrar Servicio -->
      <el-dialog
      v-model="dialogVisible"
      title="Registrar Nuevo Servicio"
      width="500px"
      :before-close="handleClose"
      >
      <!-- Componente de formulario de registro -->
      <Registrar @closeModal="dialogVisible = false" @refreshTable="fetchServicios" />
      </el-dialog>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import supabase from '@/supabase';
import Registrar from './Registrar.vue';

export default {
  components: {
    Registrar,
  },
  setup() {
    const dialogVisible = ref(false);
    const servicios = ref([]);
    const searchQuery = ref('');
    const currentPage = ref(1);
    const itemsPerPage = ref(5);

    const openRegisterModal = () => {
      dialogVisible.value = true;
    };

    const handleClose = (done) => {
      done();
    };

    const fetchServicios = async () => {
      const { data, error } = await supabase.rpc('obtenerserviciosregistrados');
      if (error) {
        console.error('Error al obtener servicios:', error.message);
      } else {
        servicios.value = data;
      }
    };

    const filteredServicios = computed(() =>
      servicios.value.filter((servicio) =>
        servicio.servicio.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        servicio.maquinaria.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    );

    const paginatedServicios = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      return filteredServicios.value.slice(start, start + itemsPerPage.value);
    });

    const handlePageChange = (page) => {
      currentPage.value = page;
    };

    onMounted(fetchServicios);

    return {
      dialogVisible,
      servicios,
      searchQuery,
      currentPage,
      itemsPerPage,
      openRegisterModal,
      handleClose,
      fetchServicios,
      filteredServicios,
      paginatedServicios,
      handlePageChange,
    };
  },
};
</script>
  
  <style scoped>
  .data-table-container {
    max-width: 800px;
    margin: auto;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    padding: 20px;
  }
  
  .search-input {
    width: 100%;
  }
  
  .page-size-select {
    width: 70px;
    margin-left: 10px;
    margin-right: 10px;
  }
  
  .date-range-filters {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .date-pickers {
    display: flex;
    gap: 10px;
  }
  
  .date-picker {
    width: 45%;
  }
  
  .clear-filters-button {
    margin-left: auto;
  }
  
  .pagination-container {
    display: auto;
    align-items: center;
    margin-top: 20px;
  }
  
  .empty-column {
    flex: 1;
  }
  
  .select-with-message {
    display: flex;
    align-items: center;
  }
  
  .page-size-message {
    margin-right: 10px;
  }
  
  .el-table th {
    background-color: #f5f5f5;
    color: #333;
    font-weight: bold;
  }
  
  .el-table td {
    color: #666;
  }
  
  .pagination {
    display: flex;
    justify-content: center;
  }
  
  .pagination .el-pagination {
    margin-top: 20px;
  }
  /* Tablets */
@media (max-width: 768px) {
  .data-table-container {
    padding: 10px;
  }

  .date-range-filters {
    flex-direction: column;
    align-items: flex-start;
  }

  .date-pickers {
    width: 100%;
    justify-content: space-between;
  }

  .pagination-container {
    flex-direction: column;
    align-items: center;
  }

  .select-with-message {
    margin-top: 10px;
  }
}

/* Móviles */
@media (max-width: 480px) {
  .data-table-container {
    padding: 5px;
  }

  h2 {
    font-size: 1.5rem;
  }

  .page-size-select {
    width: 60px;
  }

  .date-pickers {
    flex-direction: column;
    width: 100%;
  }

  .pagination-container {
    flex-direction: column;
    align-items: center;
  }

  .select-with-message {
    margin-top: 10px;
    flex-direction: column;
  }

  .page-size-message {
    margin: 0;
    margin-bottom: 5px;
  }
}
  </style>
  