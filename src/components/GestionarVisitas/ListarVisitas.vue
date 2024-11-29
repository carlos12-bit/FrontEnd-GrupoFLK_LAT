<template>
  <div class="data-table-container">
    <h2 class="text-center mb-4">Historial de Inspecciones</h2>
    <!-- Botones para exportar a Excel y abrir modal de registro -->
    <div class="button-group mb-3">
      <el-button type="primary" @click="openRegisterModal">Registrar Inspección</el-button>
      <el-button type="success" @click="exportToExcel" class="ml-3">Exportar a Excel</el-button>
    </div>
    <!-- Barra de búsqueda -->
    <el-input
      placeholder="Buscar por estado, tipo de inspección o empresa"
      v-model="searchQuery"
      @input="debouncedSearch"
      class="mb-3 search-input"
    />
    <!-- Tabla de inspecciones -->
    <el-table :data="paginatedInspecciones" style="width: 100%" border>
      <el-table-column prop="id_inspeccion" label="ID Inspección" width="120" />
      <el-table-column prop="nombre_empresa" label="Empresa" />
      <el-table-column prop="ubicacion" label="Ubicación" />
      <el-table-column prop="fecha_inicio" label="Fecha de Inicio" sortable />
      <el-table-column prop="nombre_tipo_producto" label="Tipo de Producto" />
      <el-table-column prop="estado_inspeccion" label="Estado" />
      <el-table-column label="Acciones" width="150">
        <template #default="scope">
          <el-button size="mini" type="primary" @click="openEditModal(scope.row)">Editar</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- Paginación -->
    <el-pagination
      v-model:current-page="currentPage"
      :page-size="itemsPerPage"
      :total="filteredInspecciones.length"
      layout="prev, pager, next"
      class="mt-4"
    />
  </div>
  <!-- Modal de Registro -->
  <el-dialog v-model="dialogVisible" title="Registrar Nueva Inspección" width="500px">
    <RegistrarInspeccion @closeModal="dialogVisible = false" @refreshTable="fetchInspecciones" />
  </el-dialog>
  <!-- Modal de Edición -->
  <el-dialog v-model="editDialogVisible" title="Editar Inspección" width="500px">
    <EditarInspeccion
      :inspeccion="selectedInspeccion"
      @closeModal="editDialogVisible = false"
      @refreshTable="fetchInspecciones"
    />
  </el-dialog>
</template>

<script>
import { ref, computed } from 'vue';
import debounce from 'lodash/debounce';
import * as XLSX from 'xlsx';
import supabase from '@/supabase';
import RegistrarInspeccion from './RegistrarVisita.vue';
import EditarInspeccion from './EditarVisita.vue';

export default {
  components: {
    RegistrarInspeccion,
    EditarInspeccion,
  },
  data() {
    return {
      inspecciones: [], // Datos de inspecciones
      searchQuery: '', // Consulta de búsqueda
      currentPage: 1, // Página actual
      itemsPerPage: 5, // Cantidad de elementos por página
      dialogVisible: false, // Visibilidad del modal de registro
      editDialogVisible: false, // Visibilidad del modal de edición
      selectedInspeccion: null, // Inspección seleccionada para editar
    };
  },
  computed: {
    paginatedInspecciones() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredInspecciones.slice(start, start + this.itemsPerPage);
    },
    filteredInspecciones() {
      return this.inspecciones.filter((inspeccion) => {
        const estado = inspeccion.estado_inspeccion || ''; // Valor predeterminado si es null
        const tipo = inspeccion.nombre_tipo_producto || ''; // Valor predeterminado si es null
        const empresa = inspeccion.nombre_empresa || ''; // Valor predeterminado si es null
        return (
          estado.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          tipo.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          empresa.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      });
    },
  },
  methods: {
    openRegisterModal() {
      this.dialogVisible = true;
    },
    openEditModal(inspeccion) {
      this.selectedInspeccion = { ...inspeccion }; // Copia del objeto para mantener reactividad
      this.editDialogVisible = true;
    },
    async exportToExcel() {
      const ws = XLSX.utils.json_to_sheet(this.inspecciones);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Historial_de_Inspecciones');
      XLSX.writeFile(wb, 'Historial_de_Inspecciones.xlsx');
    },
    debouncedSearch: debounce(function () {
      this.filterInspecciones();
    }, 300),
    async fetchInspecciones() {
      try {
        const { data, error } = await supabase.rpc('get_inspecciones_historial');
        if (error) {
          console.error('Error al obtener inspecciones:', error.message);
        } else {
          this.inspecciones = data || [];
        }
      } catch (err) {
        console.error('Error al conectar con Supabase:', err.message);
      }
    },
  },
  created() {
    this.fetchInspecciones();
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
.button-group {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 15px;
}
.ml-3 {
  margin-left: 10px;
}
</style>