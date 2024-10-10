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
        <el-button type="primary" class="neon-button" @click="handleSubmit">Actualizar</el-button>
      </el-form-item>
    </el-form>
  </template>
  
  <script>
  import { ref, watch, onMounted } from 'vue'
  import { supabase } from '@/supabase'
  
  export default {
    props: ['inspection'],
    setup(props, { emit }) {
      const form = ref({
        Nombre: '',
        Tipo_De_Maquinaria_id: null,
        Descripcion: ''
      });
      const maquinarias = ref([]);
  
      // Cuando cambie el tipo de inspección que se va a editar, actualizar el formulario
      watch(() => props.inspection, (newVal) => {
        if (newVal) {
          form.value.Nombre = newVal.Nombre;
          form.value.Tipo_De_Maquinaria_id = newVal.Tipo_De_Maquinaria_id;
          form.value.Descripcion = newVal.Descripcion;
        }
      }, { immediate: true });
  
      const handleSubmit = async () => {
        try {
          const { data, error } = await supabase
            .from('Tipo_de_Inspeccion')
            .update({
              Nombre: form.value.Nombre,
              Tipo_De_Maquinaria_id: form.value.Tipo_De_Maquinaria_id,
              Descripcion: form.value.Descripcion,
              ultimo_autor: GetUser() // Obtener el ID del usuario autenticado
            })
            .eq('id', props.inspection.id); // Filtrar por el ID del tipo de inspección
  
          if (error) throw error;
          emit('updated'); // Emitir el evento para que se actualice la lista
        } catch (error) {
          console.error('Error al actualizar:', error.message);
        }
      };
  
      const fetchMaquinarias = async () => {
        const { data, error } = await supabase
          .from('Tipo_De_Maquinaria')
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