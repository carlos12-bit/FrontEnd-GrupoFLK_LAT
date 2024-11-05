<template>
    <div class="data-table-container">
      <h2 class="text-center mb-4">Lista de Maquinaria Registrada</h2>
      <div class="button-group mb-3">
        <button class="btn btn-primary" @click="openRegisterModal">Registrar Maquinaria</button>
      </div>
  
      <el-input
        placeholder="Buscar por placa o tipo de maquinaria"
        v-model="searchQuery"
        class="mb-3 search-input"
      />
  
      <el-table :data="paginatedMaquinaria" style="width: 100%" border>
        <el-table-column prop="maquinaria_id" label="ID" width="60" />
        <el-table-column prop="placa" label="Placa" sortable />
        <el-table-column prop="tipo_de_maquinaria" label="Tipo de Maquinaria" sortable />
        <el-table-column prop="region" label="Región" sortable />
        <el-table-column prop="estado" label="Estado" sortable />
        <el-table-column label="Acciones" width="200">
          <template #default="scope">
            <el-button size="mini" type="primary" @click="editMaquinaria(scope.row.maquinaria_id)">Editar</el-button>
            <el-button size="mini" type="warning" @click="toggleEstado(scope.row)">
              {{ scope.row.estado === 'Activo' ? 'Inactivar' : 'Activar' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <div class="pagination-container">
        <el-pagination
          @current-change="handlePageChange"
          :current-page="currentPage"
          :page-size="itemsPerPage"
          :total="filteredMaquinaria.length"
          layout="total, prev, pager, next"
        />
      </div>
  
      <!-- Modal para Registrar Maquinaria -->
      <el-dialog v-model="dialogVisible" title="Registrar Maquinaria" width="500px" :before-close="handleClose">
        <RegistrarMaquinaria @closeModal="dialogVisible = false" @refreshTable="fetchMaquinaria" />
      </el-dialog>
  
      <!-- Modal para Editar Maquinaria -->
      <el-dialog v-model="isEditModalVisible" title="Editar Maquinaria" width="500px" @close="closeEditModal">
        <EditarMaquinaria :maquinaria="selectedMaquinaria" @maquinariaUpdated="fetchMaquinaria" @closeModal="closeEditModal" />
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
      const maquinaria = ref([]);
      const searchQuery = ref('');
      const currentPage = ref(1);
      const itemsPerPage = ref(5);
      const selectedMaquinaria = ref(null);
  
      const openRegisterModal = () => {
        dialogVisible.value = true;
      };
  
      const editMaquinaria = async (maquinariaId) => {
        const { data, error } = await supabase
          .from('maquinariaXRepresentante_De_Empresa')
          .select('*')
          .eq('id', maquinariaId)
          .single();
  
        if (error) {
          console.error('Error al obtener la maquinaria:', error.message);
          alert('Error al cargar la maquinaria para edición');
          return;
        }
  
        selectedMaquinaria.value = data;
        isEditModalVisible.value = true;
      };
  
      const toggleEstado = async (maquinaria) => {
        const nuevoEstado = maquinaria.estado === 'Activo' ? 'Inactivo' : 'Activo';
        const { error } = await supabase
          .from('maquinariaXRepresentante_De_Empresa')
          .update({ estado: nuevoEstado === 'Activo' })
          .eq('id', maquinaria.maquinaria_id);
  
        if (error) {
          console.error('Error al cambiar el estado de la maquinaria:', error.message);
        } else {
          alert(`Estado de la maquinaria actualizado a ${nuevoEstado}`);
          fetchMaquinaria();
        }
      };
  
      const fetchMaquinaria = async () => {
        const { data, error } = await supabase.rpc('ObtenerMaquinariaRegistrada', { representante_id: 1 }); // Reemplaza '1' con el ID adecuado
        if (error) {
          console.error('Error al obtener maquinaria:', error.message);
        } else {
          maquinaria.value = data;
        }
      };
  
      onMounted(fetchMaquinaria);
  
      return {
        dialogVisible,
        isEditModalVisible,
        maquinaria,
        searchQuery,
        currentPage,
        itemsPerPage,
        selectedMaquinaria,
        openRegisterModal,
        editMaquinaria,
        toggleEstado,
        fetchMaquinaria,
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