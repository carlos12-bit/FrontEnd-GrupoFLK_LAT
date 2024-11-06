<template>
    <div class="data-table-container">
      <h2 class="text-center mb-4">Historial de Inspecciones</h2>
      <div class="button-group mb-3">
        <button class="btn btn-primary" @click="openRegisterModal">Gestionar Programaciones</button>
        <button class="btn btn-success mx-3" @click="exportToExcel">Exportar a Excel</button>
      </div>
  
      <el-input
        placeholder="Buscar por tipo de inspección o lugar"
        v-model="searchQuery"
        class="mb-3 search-input"
      />
  
      <el-table :data="paginatedInspecciones" style="width: 100%" border>
        <el-table-column prop="inspeccion_id" label="ID" width="60" />
        <el-table-column prop="tipo_de_inspeccion" label="Tipo de Inspección" sortable />
        <el-table-column prop="lugar" label="Lugar" sortable />
        <el-table-column prop="fecha_y_hora" label="Fecha y Hora" sortable />
        <el-table-column prop="estado" label="Estado" sortable />
        <el-table-column label="Acciones" width="200">
          <template #default="scope">
            <el-button size="mini" type="primary" @click="editInspeccion(scope.row.inspeccion_id)">Editar</el-button>
            <el-button size="mini" type="warning" @click="toggleEstado(scope.row)">
              {{ scope.row.estado }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <div class="pagination-container">
        <el-pagination
          @current-change="handlePageChange"
          :current-page="currentPage"
          :page-size="itemsPerPage"
          :total="filteredInspecciones.length"
          layout="total, prev, pager, next"
        />
      </div>
  
      <!-- Modal para Registrar Programación -->
      <el-dialog v-model="dialogVisible" title="Gestionar Programación" width="500px" :before-close="handleClose">
        <RegistrarInspeccion @closeModal="dialogVisible = false" @refreshTable="fetchInspecciones" />
      </el-dialog>
  
      <!-- Modal para Editar Inspección -->
      <el-dialog v-model="isEditModalVisible" title="Editar Inspección" width="500px" @close="closeEditModal">
        <EditarInspeccion :inspeccion="selectedInspeccion" @inspeccionUpdated="fetchInspecciones" @closeModal="closeEditModal" />
      </el-dialog>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue';
  import supabase from '@/supabase';
  import RegistrarInspeccion from './RegistrarInspeccion.vue';
  import EditarInspeccion from './EditarInspeccion.vue';
  import * as XLSX from 'xlsx';
  
  export default {
    components: {
      RegistrarInspeccion,
      EditarInspeccion,
    },
    setup() {
      const dialogVisible = ref(false);
      const isEditModalVisible = ref(false);
      const inspecciones = ref([]);
      const searchQuery = ref('');
      const currentPage = ref(1);
      const itemsPerPage = ref(5);
      const selectedInspeccion = ref(null);
      const estados = ['Activo', 'Reprogramado', 'Pausa', 'Cancelado'];
  
      const openRegisterModal = () => {
        dialogVisible.value = true;
      };
  
      const editInspeccion = async (inspeccionId) => {
        const { data, error } = await supabase
          .from('inspeccion')
          .select('*')
          .eq('id', inspeccionId)
          .single();
  
        if (error) {
          console.error('Error al obtener la inspección:', error.message);
          alert('Error al cargar la inspección para edición');
          return;
        }
  
        selectedInspeccion.value = data;
        isEditModalVisible.value = true;
      };
  
      const toggleEstado = async (inspeccion) => {
        const nuevoEstadoIndex = (estados.indexOf(inspeccion.estado) + 1) % estados.length;
        const nuevoEstado = estados[nuevoEstadoIndex];
        const { error } = await supabase
          .from('inspeccion')
          .update({ estado: nuevoEstado })
          .eq('id', inspeccion.inspeccion_id);
  
        if (error) {
          console.error('Error al cambiar el estado de la inspección:', error.message);
        } else {
          alert(`Estado de la inspección actualizado a ${nuevoEstado}`);
          fetchInspecciones();
        }
      };
  
      const fetchInspecciones = async () => {
        const { data, error } = await supabase.rpc('ObtenerDatosInspeccion');
        if (error) {
          console.error('Error al obtener inspecciones:', error.message);
        } else {
          inspecciones.value = data;
        }
      };
  
      const filteredInspecciones = computed(() =>
        inspecciones.value.filter((inspeccion) =>
          inspeccion.tipo_de_inspeccion.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          inspeccion.lugar.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
      );
  
      const paginatedInspecciones = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage.value;
        return filteredInspecciones.value.slice(start, start + itemsPerPage.value);
      });
  
      const handlePageChange = (page) => {
        currentPage.value = page;
      };
  
      const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(inspecciones.value);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Inspecciones');
        XLSX.writeFile(wb, 'Inspecciones.xlsx');
      };
  
      onMounted(fetchInspecciones);
  
      return {
        dialogVisible,
        isEditModalVisible,
        inspecciones,
        searchQuery,
        currentPage,
        itemsPerPage,
        selectedInspeccion,
        openRegisterModal,
        editInspeccion,
        toggleEstado,
        fetchInspecciones,
        filteredInspecciones,
        paginatedInspecciones,
        handlePageChange,
        exportToExcel,
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