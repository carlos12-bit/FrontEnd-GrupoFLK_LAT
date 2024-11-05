<template>
    <div>
      <h3>Registrar Maquinaria</h3>
      <el-form ref="registerForm" label-width="120px" class="register-form">
        <el-form-item label="Placa">
          <el-input v-model="maquinaria.placa" placeholder="Ingrese la placa" />
        </el-form-item>
        
        <el-form-item label="Tipo de Maquinaria">
          <el-select v-model="maquinaria.tipo_de_maquinaria_id" placeholder="Seleccione el tipo de maquinaria">
            <el-option v-for="item in maquinariaOptions" :key="item.id" :label="item.descripcion" :value="item.id" />
          </el-select>
        </el-form-item>
  
        <el-form-item label="Estado">
          <el-select v-model="maquinaria.estado" placeholder="Seleccione el estado">
            <el-option label="Activo" value="Activo" />
            <el-option label="Inactivo" value="Inactivo" />
          </el-select>
        </el-form-item>
  
        <el-form-item>
          <el-button type="primary" @click="registerMaquinaria">Registrar</el-button>
          <el-button @click="$emit('closeModal')">Cancelar</el-button>
        </el-form-item>
      </el-form>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import supabase from '@/supabase';
  
  export default {
    emits: ['closeModal', 'refreshTable'],
    setup(_, { emit }) {
      const maquinaria = ref({
        placa: '',
        tipo_de_maquinaria_id: null,
        estado: 'Activo',
      });
  
      const maquinariaOptions = ref([]);
  
      const fetchMaquinariaOptions = async () => {
        const { data, error } = await supabase.from('Tipo_De_Maquinaria').select('id, descripcion');
        if (error) {
          console.error('Error al obtener tipos de maquinaria:', error.message);
        } else {
          maquinariaOptions.value = data;
        }
      };
  
      const registerMaquinaria = async () => {
        const { error } = await supabase
          .from('maquinariaXRepresentante_De_Empresa')
          .insert([maquinaria.value]);
  
        if (error) {
          console.error('Error al registrar maquinaria:', error.message);
        } else {
          alert('Maquinaria registrada con éxito');
          emit('refreshTable');
          emit('closeModal');
        }
      };
  
      onMounted(fetchMaquinariaOptions);
  
      return {
        maquinaria,
        maquinariaOptions,
        registerMaquinaria,
      };
    },
  };
  </script>
  
  <style scoped>
  .register-form {
    max-width: 400px;
    margin: auto;
  }
  </style>