<template>
    <div>
      <p>¿Está seguro de que desea eliminar este tipo de inspección?</p>
      <el-button type="danger" @click="handleDelete">Eliminar</el-button>
      <el-button @click="$emit('close')">Cancelar</el-button>
    </div>
  </template>
  
  <script>
  import { supabase } from '@/supabase'
  
  export default {
    props: ['inspectionId'],
    methods: {
      async handleDelete() {
        try {
          const { error } = await supabase
            .from('tipo_de_inspeccion')
            .delete()
            .eq('id', this.inspectionId)
  
          if (error) throw error;
          this.$emit('deleted'); // Emite un evento para actualizar la lista
        } catch (error) {
          console.error('Error al eliminar:', error.message);
        }
      }
    }
  }
  </script>
  