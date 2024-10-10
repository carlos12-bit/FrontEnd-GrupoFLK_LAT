<template>
    <el-dialog
      :visible.sync="dialogVisible"
      title="Eliminar Maquinaria"
      @close="dialogVisible = false"
    >
      <span>¿Estás seguro de eliminar este tipo de maquinaria?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancelar</el-button>
        <el-button type="danger" @click="handleDelete">Eliminar</el-button>
      </span>
    </el-dialog>
  </template>
  
  <script>
  import { supabase } from '@/supabase'
  
  export default {
    props: {
      maquinariaId: Number,
    },
    data() {
      return {
        dialogVisible: false,
      }
    },
    methods: {
      async handleDelete() {
        const { error } = await supabase
          .from('tipo_de_maquinaria')
          .delete()
          .eq('id', this.maquinariaId)
  
        if (error) {
          this.$message.error('Error al eliminar el tipo de maquinaria')
        } else {
          this.$message.success('Tipo de maquinaria eliminado con éxito')
          this.dialogVisible = false
          this.$emit('deleted')
        }
      },
    },
  }
  </script>
  