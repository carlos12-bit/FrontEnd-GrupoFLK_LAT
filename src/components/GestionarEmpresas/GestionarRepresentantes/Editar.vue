<template>
    <div>
      <h3>Editar Representante</h3>
      <el-form ref="editForm" label-width="120px" class="edit-form">
        <el-form-item label="Nombre">
          <el-input v-model="editedRepresentante.nombre" placeholder="Ingrese el nombre" />
        </el-form-item>
        
        <el-form-item label="Apellido Paterno">
          <el-input v-model="editedRepresentante.apellido_paterno" placeholder="Ingrese el apellido paterno" />
        </el-form-item>
        
        <el-form-item label="Apellido Materno">
          <el-input v-model="editedRepresentante.apellido_materno" placeholder="Ingrese el apellido materno" />
        </el-form-item>
  
        <el-form-item label="Correo Electrónico">
          <el-input v-model="editedRepresentante.correo_electronico" placeholder="Ingrese el correo electrónico" />
        </el-form-item>
  
        <el-form-item label="Número de Contacto">
          <el-input v-model="editedRepresentante.numero_de_contacto" placeholder="Ingrese el número de contacto" />
        </el-form-item>
  
        <el-form-item label="Estado">
          <el-select v-model="editedRepresentante.estado" placeholder="Seleccione el estado">
            <el-option label="Activo" value="Activo" />
            <el-option label="Reprogramado" value="Reprogramado" />
            <el-option label="Pausa" value="Pausa" />
            <el-option label="Cancelado" value="Cancelado" />
          </el-select>
        </el-form-item>
  
        <el-form-item>
          <el-button type="primary" @click="updateRepresentante">Guardar Cambios</el-button>
          <el-button @click="$emit('closeModal')">Cancelar</el-button>
        </el-form-item>
      </el-form>
    </div>
  </template>
  
  <script>
  import { ref, watch } from 'vue';
  import supabase from '@/supabase';
  
  export default {
    props: {
      representante: Object,
    },
    emits: ['representanteUpdated', 'closeModal'],
    setup(props, { emit }) {
      const editedRepresentante = ref({ ...props.representante });
  
      watch(
        () => props.representante,
        (newRepresentante) => {
          editedRepresentante.value = { ...newRepresentante };
        },
        { immediate: true }
      );
  
      const updateRepresentante = async () => {
        const { error } = await supabase
          .from('Representante_De_Empresa')
          .update({
            nombre: editedRepresentante.value.nombre,
            apellido_paterno: editedRepresentante.value.apellido_paterno,
            apellido_materno: editedRepresentante.value.apellido_materno,
            correo_electronico: editedRepresentante.value.correo_electronico,
            numero_de_contacto: editedRepresentante.value.numero_de_contacto,
            estado: editedRepresentante.value.estado,
          })
          .eq('id', editedRepresentante.value.id);
  
        if (error) {
          console.error('Error al actualizar el representante:', error.message);
        } else {
          alert('Representante actualizado con éxito');
          emit('representanteUpdated');
          emit('closeModal');
        }
      };
  
      return {
        editedRepresentante,
        updateRepresentante,
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