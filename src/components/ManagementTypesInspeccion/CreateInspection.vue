<template>
  <el-form :model="form" label-width="120px">
    <el-form-item label="Nombre">
      <el-input v-model="form.Nombre" placeholder="Nombre"></el-input>
    </el-form-item>
    <el-form-item label="Tipo de Maquinaria">
      <el-select v-model="form.Tipo_De_Maquinaria_id" placeholder="Seleccionar Tipo de Maquinaria">
        <el-option v-for="maquinaria in maquinarias" :key="maquinaria.id" :label="maquinaria.descripcion" :value="maquinaria.id" />
      </el-select>
    </el-form-item>
    <el-form-item label="Descripción">
      <el-input v-model="form.Descripcion" placeholder="Descripción"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" class="neon-button" @click="handleSubmit">Guardar</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabase'
import { GetUser } from '../../auth';

export default {
  setup(props, { emit }) {
    const form = ref({
      Nombre: '',
      Tipo_De_Maquinaria_id: null,
      Descripcion: '',
      userId: GetUser() // Asume que GetUser solo devuelve el ID
    });
    const maquinarias = ref([]);

    const handleSubmit = async () => {
      try {
        const { data, error } = await supabase
          .from('tipo_de_inspeccion')
          .insert([
            {
              nombre: form.value.Nombre,
              tipo_de_maquinaria_id: form.value.Tipo_De_Maquinaria_id,
              descripcion: form.value.Descripcion,
              autor: form.value.userId,
              ultimo_autor: form.value.userId
            }
          ]);

        if (error) throw error;
        emit('created'); // Emite un evento para actualizar la lista
      } catch (error) {
        console.error('Error al insertar:', error.message);
      }
    };

    const fetchMaquinarias = async () => {
      const { data, error } = await supabase
        .from('tipo_de_maquinaria')
        .select('id, descripcion');
        
      if (!error) {
        maquinarias.value = data;
      }
    };

    onMounted(fetchMaquinarias);

    return {
      form,
      maquinarias,
      handleSubmit
    };
  }
}
</script>
