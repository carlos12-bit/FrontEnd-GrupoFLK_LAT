<template>
  <div>
    <p>¿Está seguro de que desea eliminar este tipo de maquinaria?</p>
    <el-button type="danger" @click="handleDelete">Eliminar</el-button>
    <el-button @click="$emit('close')">Cancelar</el-button>
  </div>
</template>

<script>
import { supabase } from '@/supabase'

export default {
  props: ['maquinariaId'],
  methods: {
    async handleDelete() {
      try {
        const { error } = await supabase
          .from('tipo_de_maquinaria')
          .delete()
          .eq('id', this.maquinariaId)

        if (error) throw error
        this.$emit('deleted') // Emite un evento para actualizar la lista
      } catch (error) {
        console.error('Error al eliminar:', error.message)
      }
    }
  }
}
</script>