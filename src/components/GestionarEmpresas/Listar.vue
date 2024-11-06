<template>
  <div class="data-table-container">
    <h2 class="text-center mb-4">Historial de Empresas Registradas</h2>
    <div class="button-group mb-3">
      <button class="btn btn-primary" @click="openRegisterModal">Registrar Empresa</button>
      <button class="btn btn-success mx-3" @click="exportToExcel">Exportar a Excel</button>
    </div>

    <el-input
      placeholder="Buscar por nombre de empresa o país"
      v-model="searchQuery"
      class="mb-3 search-input"
    />

    <el-table :data="paginatedEmpresas" style="width: 100%" border>
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="nombre_empresa" label="Nombre de Empresa" sortable />
      <el-table-column prop="pais" label="País" sortable />
      <el-table-column label="Acciones" width="200">
        <template #default="scope">
          <el-button size="mini" @click="viewDetails(scope.row.id)">Detalle</el-button>
          <el-button size="mini" type="primary" @click="editCompany(scope.row.id)">Editar</el-button>
          <el-button size="mini" type="warning" @click="toggleEstado(scope.row)">
            {{ scope.row.estado ? 'Inactivar' : 'Activar' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Contenedor de paginación -->
    <div class="pagination-container">
      <el-pagination
        @current-change="handlePageChange"
        :current-page="currentPage"
        :page-size="itemsPerPage"
        :total="filteredEmpresas.length"
        layout="total, prev, pager, next"
      />
      <div class="select-with-message mt-1">
        <span class="page-size-message">Mostrar</span>
        <el-select v-model="itemsPerPage" @change="handleItemsPerPageChange" class="page-size-select" placeholder="Items por página">
          <el-option label="5" :value="5" />
          <el-option label="10" :value="10" />
          <el-option label="15" :value="15" />
          <el-option label="20" :value="20" />
        </el-select>
        <span class="page-size-message">registros</span>
      </div>
    </div>

    <!-- Modal para Registrar Empresa -->
    <el-dialog
      v-model="dialogVisible"
      title="Registrar Nueva Empresa"
      width="500px"
      :before-close="handleClose"
    >
      <RegistrarEmpresa @closeModal="dialogVisible = false" @refreshTable="fetchEmpresas" />
    </el-dialog>

    <!-- Modal para Editar Empresa -->
    <el-dialog
      v-model="isEditModalVisible"
      title="Editar Empresa"
      width="500px"
      @close="closeEditModal"
    >
      <EditarEmpresa :company="selectedCompany" @companyUpdated="fetchEmpresas" @closeModal="closeEditModal" />
    </el-dialog>

    <!-- Modal para Confirmar Eliminación -->
    <el-dialog
      v-model="isDeleteModalVisible"
      title="Eliminar Empresa"
      width="400px"
      @close="closeDeleteModal"
    >
      <p>¿Estás seguro de que deseas eliminar esta empresa?</p>
      <el-button type="danger" @click="confirmDeleteCompany">Eliminar</el-button>
      <el-button @click="closeDeleteModal">Cancelar</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import supabase from '@/supabase';
import * as XLSX from 'xlsx';
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
    const isDeleteModalVisible = ref(false);
    const empresas = ref([]);
    const searchQuery = ref('');
    const currentPage = ref(1);
    const itemsPerPage = ref(5);
    const selectedCompany = ref(null);

    const openRegisterModal = () => {
      dialogVisible.value = true;
    };

    const viewDetails = (companyId) => {
      alert(`Detalles de la empresa con ID: ${companyId}`);
    };

    const editCompany = async (companyId) => {
      const { data, error } = await supabase
        .from('empresa')
        .select('*')
        .eq('id', companyId)
        .single();

      if (error) {
        console.error('Error al obtener la empresa:', error.message);
        alert('Error al cargar la empresa para edición');
        return;
      }

      selectedCompany.value = data;
      isEditModalVisible.value = true;
    };

    const toggleEstado = async (company) => {
      const nuevoEstado = !company.estado;
      const { error } = await supabase
        .from('empresa')
        .update({ estado: nuevoEstado })
        .eq('id', company.id);

      if (error) {
        console.error('Error al cambiar el estado de la empresa:', error.message);
      } else {
        alert(`Estado de la empresa actualizado a ${nuevoEstado ? 'Activo' : 'Inactivo'}`);
        fetchEmpresas();
      }
    };

    const closeEditModal = () => {
      isEditModalVisible.value = false;
      selectedCompany.value = null;
    };

    const deleteCompany = (company) => {
      selectedCompany.value = company;
      isDeleteModalVisible.value = true;
    };

    const closeDeleteModal = () => {
      isDeleteModalVisible.value = false;
      selectedCompany.value = null;
    };

    const handleClose = (done) => {
      done();
    };

    const fetchEmpresas = async () => {
      const { data, error } = await supabase.rpc('ObtenerDatosEmpresaPais');
      if (error) {
        console.error('Error al obtener empresas:', error.message);
      } else {
        empresas.value = data;
      }
    };

    const filteredEmpresas = computed(() =>
      empresas.value.filter((empresa) =>
        empresa.nombre_empresa.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        empresa.pais.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    );

    const paginatedEmpresas = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      return filteredEmpresas.value.slice(start, start + itemsPerPage.value);
    });

    const handlePageChange = (page) => {
      currentPage.value = page;
    };

    const handleItemsPerPageChange = (value) => {
      itemsPerPage.value = value;
      currentPage.value = 1;
    };

    const exportToExcel = () => {
      const ws = XLSX.utils.json_to_sheet(empresas.value);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Empresas');
      XLSX.writeFile(wb, 'Empresas.xlsx');
    };

    const confirmDeleteCompany = async () => {
      const { error } = await supabase
        .from('empresa')
        .delete()
        .eq('id', selectedCompany.value.id);
      if (error) {
        console.error('Error al eliminar empresa:', error.message);
      } else {
        alert('Empresa eliminada con éxito');
        fetchEmpresas();
        closeDeleteModal();
      }
    };

    onMounted(fetchEmpresas);

    return {
      dialogVisible,
      isEditModalVisible,
      isDeleteModalVisible,
      empresas,
      searchQuery,
      currentPage,
      itemsPerPage,
      selectedCompany,
      openRegisterModal,
      viewDetails,
      editCompany,
      toggleEstado,
      closeEditModal,
      deleteCompany,
      closeDeleteModal,
      handleClose,
      fetchEmpresas,
      filteredEmpresas,
      paginatedEmpresas,
      handlePageChange,
      handleItemsPerPageChange,
      exportToExcel,
      confirmDeleteCompany,
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

.pagination-container {
  display: auto;
  align-items: center;
  margin-top: 20px;
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
</style>