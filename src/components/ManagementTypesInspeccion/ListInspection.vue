<template>
  <el-table :data="inspections" style="width: 100%">
    <el-table-column prop="nombre" label="Nombre"></el-table-column>
    <el-table-column prop="descripcion" label="Descripción"></el-table-column>
    <el-table-column label="Acciones">
      <template #default="scope">
        <el-button type="primary" @click="handleEdit(scope.row)">Editar</el-button>
        <el-button type="danger" @click="handleDelete(scope.row)">Eliminar</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { supabase } from '@/supabase'

export default {
  name: 'ListInspection',
  data() {
    return {
      inspections: [], // Lista de inspecciones vacía al inicio
    }
  },
  mounted() {
    this.fetchInspections(); // Cargar las inspecciones al montar el componente
  },
  methods: {
    // Función para obtener las inspecciones desde la base de datos
    async fetchInspections() {
      try {
        const { data, error } = await supabase
          .from('tipo_de_inspeccion')
          .select('*');

        if (error) {
          this.$message.error('Error al obtener tipos de inspección');
          return;
        }

        // Asignar los datos obtenidos a la lista de inspecciones
        this.inspections = data;
      } catch (err) {
        console.error('Error al cargar inspecciones:', err.message);
        this.$message.error('Error inesperado al cargar inspecciones');
      }
    },

    // Función para manejar la edición de una inspección
    handleEdit(inspection) {
      this.$emit('edit', inspection);
    },

    // Función para manejar la eliminación de una inspección
    handleDelete(inspection) {
      this.$emit('delete', inspection);
    },
  },
}
</script>
