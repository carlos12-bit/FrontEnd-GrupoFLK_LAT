<template>
    <div>
      <h3>Registrar Representante</h3>
      <el-form ref="registerForm" label-width="120px" class="register-form">
        <el-form-item label="Nombre">
          <el-input v-model="representante.nombre" placeholder="Ingrese el nombre" />
        </el-form-item>
        
        <el-form-item label="Apellido Paterno">
          <el-input v-model="representante.apellido_paterno" placeholder="Ingrese el apellido paterno" />
        </el-form-item>
        
        <el-form-item label="Apellido Materno">
          <el-input v-model="representante.apellido_materno" placeholder="Ingrese el apellido materno" />
        </el-form-item>
  
        <el-form-item label="Correo Electrónico">
          <el-input v-model="representante.correo_electronico" placeholder="Ingrese el correo electrónico" />
        </el-form-item>
  
        <el-form-item label="Número de Contacto">
          <el-input v-model="representante.numero_de_contacto" placeholder="Ingrese el número de contacto" />
        </el-form-item>
  
        <el-form-item label="Provincia">
          <el-select v-model="representante.provincia_id" placeholder="Seleccione la provincia">
            <el-option v-for="provincia in provinciaOptions" :key="provincia.id" :label="provincia.nombre" :value="provincia.id" />
          </el-select>
        </el-form-item>
  
        <el-form-item label="Estado">
          <el-select v-model="representante.estado" placeholder="Seleccione el estado">
            <el-option label="Activo" value="Activo" />
            <el-option label="Reprogramado" value="Reprogramado" />
            <el-option label="Pausa" value="Pausa" />
            <el-option label="Cancelado" value="Cancelado" />
          </el-select>
        </el-form-item>
  
        <el-form-item>
          <el-button type="primary" @click="registerRepresentante">Registrar</el-button>
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
      const representante = ref({
        nombre: '',
        apellido_paterno: '',
        apellido_materno: '',
        correo_electronico: '',
        numero_de_contacto: '',
        provincia_id: null,
        estado: 'Activo',
      });
  
      const provinciaOptions = ref([]);
  
      const fetchProvincias = async () => {
        const { data, error } = await supabase.from('provincia').select('id, nombre');
        if (error) {
          console.error('Error al obtener provincias:', error.message);
        } else {
          provinciaOptions.value = data;
        }
      };
  
      const registerRepresentante = async () => {
        const { error } = await supabase
          .from('Representante_De_Empresa')
          .insert([representante.value]);
  
        if (error) {
          console.error('Error al registrar representante:', error.message);
        } else {
          alert('Representante registrado con éxito');
          emit('refreshTable');
          emit('closeModal');
        }
      };
  
      onMounted(fetchProvincias);
  
      return {
        representante,
        provinciaOptions,
        registerRepresentante,
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