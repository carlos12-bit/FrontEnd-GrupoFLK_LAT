<template>
    <div>
      <h3>Editar Maquinaria</h3>
      <el-form ref="editForm" label-width="120px" class="edit-form">
        <el-form-item label="Placa">
          <el-input v-model="editedMaquinaria.placa" placeholder="Ingrese la placa" />
        </el-form-item>
        
        <el-form-item label="Tipo de Maquinaria">
          <el-select v-model="editedMaquinaria.tipo_de_maquinaria_id" placeholder="Seleccione el tipo de maquinaria">
            <el-option v-for="item in maquinariaOptions" :key="item.id" :label="item.descripcion" :value="item.id" />
          </el-select>
        </el-form-item>
  
        <el-form-item label="Estado">
          <el-select v-model="editedMaquinaria.estado" placeholder="Seleccione el estado">
            <el-option label="Activo" value="Activo" />
            <el-option label="Inactivo" value="Inactivo" />
          </el-select>
        </el-form-item>
  
        <el-form-item>
          <el-button type="primary" @click="updateMaquinaria">Guardar Cambios</el-button>
          <el-button @click="$emit('closeModal')">Cancelar</el-button>
        </el-form-item>
      </el-form>
    </div>
  </template>
  
  <script>
  import { ref, watch, onMounted } from 'vue';
  import supabase from '@/supabase';
  
  export default {
    props: {
      maquinaria: Object,
    },
    emits: ['maquinariaUpdated', 'closeModal'],
    setup(props, { emit }) {
      const editedMaquinaria = ref({ ...props.maquinaria });
      const maquinariaOptions = ref([]);
  
      watch(
        () => props.maquinaria,
        (newMaquinaria) => {
          editedMaquinaria.value = { ...newMaquinaria };
        },
        { immediate: true }
      );
  
      const fetchMaquinariaOptions = async () => {
        const { data, error } = await supabase.from('Tipo_De_Maquinaria').select('id, descripcion');
        if (error) {
          console.error('Error al obtener tipos de maquinaria:', error.message);
        } else {
          maquinariaOptions.value = data;
        }
      };
  
      const updateMaquinaria = async () => {
        const { error } = await supabase
          .from('maquinariaXRepresentante_De_Empresa')
          .update({
            placa: editedMaquinaria.value.placa,
            tipo_de_maquinaria_id: editedMaquinaria.value.tipo_de_maquinaria_id,
            estado: editedMaquinaria.value.estado,
          })
          .eq('id', editedMaquinaria.value.id);
  
        if (error) {
          console.error('Error al actualizar la maquinaria:', error.message);
        } else {
          alert('Maquinaria actualizada con éxito');
          emit('maquinariaUpdated');
          emit('closeModal');
        }
      };
  
      onMounted(fetchMaquinariaOptions);
  
      return {
        editedMaquinaria,
        maquinariaOptions,
        updateMaquinaria,
      };
    },
  };
  </script>
  
  <style scoped>
  .edit-form {
    max-width: 400px;
    margin: auto;
  }
  </style>