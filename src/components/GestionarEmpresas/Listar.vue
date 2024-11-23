<template>
  <div class="data-table-container">
    <h2 class="text-center mb-4">Listado de Empresas</h2>

    <!-- Barra de búsqueda -->
    <el-input
      placeholder="Buscar por RUC o Nombre Comercial"
      v-model="searchQuery"
      @input="debouncedFetch"
      class="mb-3 search-input"
    />

    <!-- Tabla de empresas -->
    <el-table :data="empresas" style="width: 100%" border v-loading="loading">
      <el-table-column prop="nro_identificacion" label="RUC" width="120" />
      <el-table-column prop="nombre_comercial" label="Nombre Comercial" sortable />
      <el-table-column prop="pais_nombre" label="País" sortable />
      <el-table-column label="Acciones" width="250">
        <template #default="scope">
          <el-button size="mini" type="primary" @click="openEditModal(scope.row)">
            Editar
          </el-button>
          <el-button size="mini" type="success" @click="openRepresentantesModal(scope.row)">
            Representantes
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  
    <!-- Paginación -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="totalItems"
      :page-size="itemsPerPage"
      @current-change="handlePageChange"
    />

    <!-- Modal de Edición -->
    <el-dialog v-model="editDialogVisible" title="Editar Empresa" width="600px">
      <EditarEmpresa
        v-if="selectedEmpresa"
        :empresaInicial="selectedEmpresa"
        @closeModal="closeEditModal"
        @refreshTable="fetchEmpresas"
      />
    </el-dialog>

    <!-- Modal de Representantes -->
    <el-dialog
      v-model="representantesDialogVisible"
      width="800px"
    >
      <ListarRepresentantes
        v-if="selectedEmpresa"
        :empresaId="selectedEmpresa.id"
        :empresaNombre="selectedEmpresa.nombre_comercial"
      />
    </el-dialog>
</template>

<script>
import { ref, computed } from 'vue';
import debounce from 'lodash/debounce';
import supabase from '@/supabase';
import EditarEmpresa from './Editar.vue';
import ListarRepresentantes from './GestionarRepresentantes/Listar.vue';

export default {
  components: {
    EditarEmpresa,
    ListarRepresentantes,
  },
  setup() {
    const empresas = ref([]);
    const searchQuery = ref('');
    const currentPage = ref(1);
    const itemsPerPage = ref(10);
    const totalItems = ref(0);
    const loading = ref(false);

    const editDialogVisible = ref(false);
    const representantesDialogVisible = ref(false);
    const selectedEmpresa = ref(null);

    const debouncedFetch = debounce(() => fetchEmpresas(), 300);

    const fetchEmpresas = async () => {
      loading.value = true;
      try {
        const { data, error, count } = await supabase
          .from('empresa')
          .select('id, nro_identificacion, nombre_comercial, pais_id', { count: 'exact' })
          .ilike('nro_identificacion', `%${searchQuery.value}%`)
          .range((currentPage.value - 1) * itemsPerPage.value, currentPage.value * itemsPerPage.value - 1);

        if (error) throw error;

        totalItems.value = count;
        empresas.value = data.map((empresa) => ({
          ...empresa,
          pais_nombre: getPaisNombre(empresa.pais_id),
        }));
      } catch (err) {
        console.error('Error al obtener empresas:', err.message);
      } finally {
        loading.value = false;
      }
    };

    const getPaisNombre = (paisId) => {
      // Supongamos que esta función devuelve el nombre del país según su ID
      return "País de Ejemplo"; // Esto se puede mejorar con una caché local
    };

    const handlePageChange = (page) => {
      currentPage.value = page;
      fetchEmpresas();
    };

    const openEditModal = (empresa) => {
      selectedEmpresa.value = empresa;
      editDialogVisible.value = true;
    };

    const closeEditModal = () => {
      editDialogVisible.value = false;
      selectedEmpresa.value = null;
    };

    const openRepresentantesModal = (empresa) => {
      selectedEmpresa.value = empresa;
      representantesDialogVisible.value = true;
    };

    return {
      empresas,
      searchQuery,
      currentPage,
      itemsPerPage,
      totalItems,
      loading,
      editDialogVisible,
      representantesDialogVisible,
      selectedEmpresa,
      debouncedFetch,
      fetchEmpresas,
      handlePageChange,
      openEditModal,
      closeEditModal,
      openRepresentantesModal,
    };
  },
  mounted() {
    this.fetchEmpresas();
  },
};
</script>

<style scoped>
.data-table-container {
  max-width: 1200px;
  margin: auto;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.search-input {
  width: 100%;
}

.el-table {
  margin-top: 20px;
}

.ml-3 {
  margin-left: 10px;
}
</style>