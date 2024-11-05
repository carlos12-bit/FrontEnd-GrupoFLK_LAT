<template>
    <div class="data-table-container">
      <h2 class="text-center mb-4">Lista de Representantes</h2>
      <div class="button-group mb-3">
        <button class="btn btn-primary" @click="openRegisterModal">Registrar Representante</button>
      </div>
  
      <el-input
        placeholder="Buscar por nombre o provincia"
        v-model="searchQuery"
        class="mb-3 search-input"
      />
  
      <el-table :data="paginatedRepresentantes" style="width: 100%" border>
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="provincia" label="Provincia" sortable />
        <el-table-column prop="region" label="Región" sortable />
        <el-table-column prop="nombre_completo" label="Nombre Completo" sortable />
        <el-table-column prop="estado" label="Estado" sortable />
        <el-table-column label="Acciones" width="200">
          <template #default="scope">
            <el-button size="mini" @click="viewDetails(scope.row.id)">Detalle</el-button>
            <el-button size="mini" type="primary" @click="editRepresentante(scope.row.id)">Editar</el-button>
            <el-button size="mini" type="warning" @click="toggleEstado(scope.row)">
              {{ scope.row.estado === 'Activo' ? 'Cambiar Estado' : 'Activar' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <div class="pagination-container">
        <el-pagination
          @current-change="handlePageChange"
          :current-page="currentPage"
          :page-size="itemsPerPage"
          :total="filteredRepresentantes.length"
          layout="total, prev, pager, next"
        />
      </div>
  
      <!-- Modal para Registrar Representante -->
      <el-dialog v-model="dialogVisible" title="Registrar Representante" width="500px" :before-close="handleClose">
        <RegistrarRepresentante @closeModal="dialogVisible = false" @refreshTable="fetchRepresentantes" />
      </el-dialog>
  
      <!-- Modal para Editar Representante -->
      <el-dialog v-model="isEditModalVisible" title="Editar Representante" width="500px" @close="closeEditModal">
        <EditarRepresentante :representante="selectedRepresentante" @representanteUpdated="fetchRepresentantes" @closeModal="closeEditModal" />
      </el-dialog>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue';
  import supabase from '@/supabase';
  import Registrar from './Registrar.vue';
  import Editar from './Editar.vue';
  
  export default {
    components: {
      Registrar,
      Editar,
    },
    setup() {
      const dialogVisible = ref(false);
      const isEditModalVisible = ref(false);
      const representantes = ref([]);
      const searchQuery = ref('');
      const currentPage = ref(1);
      const itemsPerPage = ref(5);
      const selectedRepresentante = ref(null);
  
      const openRegisterModal = () => {
        dialogVisible.value = true;
      };
  
      const viewDetails = (representanteId) => {
        alert(`Detalles del representante con ID: ${representanteId}`);
      };
  
      const editRepresentante = async (representanteId) => {
        const { data, error } = await supabase
          .from('Representante_De_Empresa')
          .select('*')
          .eq('id', representanteId)
          .single();
  
        if (error) {
          console.error('Error al obtener el representante:', error.message);
          alert('Error al cargar el representante para edición');
          return;
        }
  
        selectedRepresentante.value = data;
        isEditModalVisible.value = true;
      };
  
      const toggleEstado = async (representante) => {
        const nuevoEstado = representante.estado === 'Activo' ? 'Inactivo' : 'Activo';
        const { error } = await supabase
          .from('Representante_De_Empresa')
          .update({ estado: nuevoEstado === 'Activo' })
          .eq('id', representante.id);
  
        if (error) {
          console.error('Error al cambiar el estado del representante:', error.message);
        } else {
          alert(`Estado del representante actualizado a ${nuevoEstado}`);
          fetchRepresentantes();
        }
      };
  
      const fetchRepresentantes = async () => {
        const { data, error } = await supabase.rpc('ObtenerDatosRepresentante');
        if (error) {
          console.error('Error al obtener representantes:', error.message);
        } else {
          representantes.value = data;
        }
      };
  
      onMounted(fetchRepresentantes);
  
      return {
        dialogVisible,
        isEditModalVisible,
        representantes,
        searchQuery,
        currentPage,
        itemsPerPage,
        selectedRepresentante,
        openRegisterModal,
        viewDetails,
        editRepresentante,
        toggleEstado,
        fetchRepresentantes,
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
    padding: 20px;
  }
  </style>