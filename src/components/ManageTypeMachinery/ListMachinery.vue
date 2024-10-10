<template>
  <el-table :data="maquinarias" style="width: 100%">
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
  name: 'ListMachinery',
  data() {
    return {
      maquinarias: [],
    }
  },
  mounted() {
    this.fetchMachineries()
  },
  methods: {
    async fetchMachineries() {
      const { data, error } = await supabase
        .from('tipo_de_maquinaria')
        .select('*')

      if (error) {
        this.$message.error('Error al obtener tipos de maquinaria')
      } else {
        this.maquinarias = data
      }
    },
    handleEdit(maquinaria) {
      this.$emit('edit', maquinaria)
    },
    handleDelete(maquinaria) {
      this.$emit('delete', maquinaria)
    },
  },
}
</script>