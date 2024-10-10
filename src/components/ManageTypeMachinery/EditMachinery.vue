<template>
    <el-form :model="form" label-width="120px">
      <el-form-item label="Descripción">
        <el-input v-model="form.descripcion" placeholder="Descripción"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="neon-button" @click="handleSubmit">Actualizar</el-button>
      </el-form-item>
    </el-form>
  </template>
  
  <script>
  import { ref, watch } from 'vue'
  import { supabase } from '@/supabase'
  
  export default {
    props: ['machinery'],
    setup(props, { emit }) {
      const form = ref({
        descripcion: ''
      })
  
      watch(() => props.machinery, (newVal) => {
        if (newVal) {
          form.value.descripcion = newVal.descripcion
        }
      }, { immediate: true })
  
      const handleSubmit = async () => {
        try {
          const { data, error } = await supabase
            .from('tipo_de_maquinaria')
            .update({ descripcion: form.value.descripcion })
            .eq('id', props.machinery.id)
  
          if (error) throw error
          emit('updated') // Emite un evento para actualizar la lista
        } catch (error) {
          console.error('Error al actualizar:', error.message)
        }
      }
  
      return {
        form,
        handleSubmit
      }
    }
  }
  </script>
  