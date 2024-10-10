<template>
  <el-form :model="form" label-width="120px">
    <el-form-item label="Descripción">
      <el-input v-model="form.descripcion" placeholder="Descripción"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" class="neon-button" @click="handleSubmit">Guardar</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { ref } from 'vue'
import { supabase } from '@/supabase'
import { GetUser } from '../../auth';

export default {
  setup(props, { emit }) {
    const form = ref({
      descripcion: '',
      userId: GetUser() // Asume que GetUser solo devuelve el ID
    })

    const handleSubmit = async () => {
      try {
        const { data, error } = await supabase
          .from('tipo_de_maquinaria')
          .insert([
            {
              descripcion: form.value.descripcion,
              autor: form.value.userId,
              ultimo_autor: form.value.userId
            }
          ])

        if (error) throw error
        emit('created') // Emite un evento para actualizar la lista
      } catch (error) {
        console.error('Error al insertar:', error.message)
      }
    }

    return {
      form,
      handleSubmit
    }
  }
}
</script>