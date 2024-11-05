<template>
    <div>
      <h3>Editar Empresa</h3>
      <el-form ref="editForm" label-width="120px" class="edit-form">
        <el-form-item label="RUC de la Empresa">
          <el-input v-model="editedCompany.ruc" placeholder="Ingrese el RUC de la empresa" />
        </el-form-item>
        
        <el-form-item label="Nombre Comercial">
          <el-input v-model="editedCompany.nombre_comercial" placeholder="Ingrese el nombre comercial" />
        </el-form-item>
        
        <el-form-item label="Razón Social">
          <el-input v-model="editedCompany.razon_social" placeholder="Ingrese la razón social" />
        </el-form-item>
        
        <el-form-item label="País">
          <el-select v-model="editedCompany.pais_id" placeholder="Seleccione el país">
            <el-option v-for="pais in paisOptions" :key="pais.id" :label="pais.nombre" :value="pais.id" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="Región">
          <el-select v-model="editedCompany.region_id" placeholder="Seleccione la región">
            <el-option v-for="region in regionOptions" :key="region.id" :label="region.nombre" :value="region.id" />
          </el-select>
        </el-form-item>
  
        <el-form-item label="Dirección Central">
          <el-input v-model="editedCompany.direccion_central" placeholder="Ingrese la dirección central" />
        </el-form-item>
  
        <el-form-item>
          <el-button type="primary" @click="updateCompany">Guardar Cambios</el-button>
          <el-button @click="$emit('closeModal')">Cancelar</el-button>
        </el-form-item>
      </el-form>
    </div>
  </template>
  
  <script>
  import { ref, watch, onMounted } from 'vue';
  import supabase from '@/supabase';
  import { GetUser } from '@/auth';
  
  export default {
    props: {
      company: Object, // Empresa a editar
    },
    emits: ['companyUpdated', 'closeModal'],
    setup(props, { emit }) {
      // Crear una copia editable de la empresa que se pasa como prop
      const editedCompany = ref({ ...props.company });
      const paisOptions = ref([]);
      const regionOptions = ref([]);
  
      // Observar cambios en `props.company` y actualizar `editedCompany` en consecuencia
      watch(
        () => props.company,
        (newCompany) => {
          editedCompany.value = { ...newCompany };
        },
        { immediate: true }
      );
  
      // Cargar opciones de país y región desde la base de datos
      const fetchPaisOptions = async () => {
        const { data, error } = await supabase.from('pais').select('id, nombre');
        if (error) {
          console.error('Error al obtener países:', error.message);
        } else {
          paisOptions.value = data;
        }
      };
  
      const fetchRegionOptions = async () => {
        const { data, error } = await supabase.from('region').select('id, nombre');
        if (error) {
          console.error('Error al obtener regiones:', error.message);
        } else {
          regionOptions.value = data;
        }
      };
  
      // Función para actualizar la empresa
      const updateCompany = async () => {
        if (!editedCompany.value.ruc || !editedCompany.value.nombre_comercial || !editedCompany.value.razon_social || !editedCompany.value.pais_id || !editedCompany.value.region_id) {
          alert('Por favor complete todos los campos');
          return;
        }
  
        // Actualizar el campo `ultimo_autor`
        editedCompany.value.ultimo_autor = GetUser();
  
        // Actualizar la empresa en la base de datos
        const { error } = await supabase
          .from('empresa')
          .update({
            ruc: editedCompany.value.ruc,
            nombre_comercial: editedCompany.value.nombre_comercial,
            razon_social: editedCompany.value.razon_social,
            pais_id: editedCompany.value.pais_id,
            region_id: editedCompany.value.region_id,
            direccion_central: editedCompany.value.direccion_central,
            ultimo_autor: editedCompany.value.ultimo_autor,
          })
          .eq('id', editedCompany.value.id);
  
        if (error) {
          console.error('Error al actualizar la empresa:', error.message);
          alert(`Error al actualizar la empresa: ${error.message}`);
        } else {
          alert('Empresa actualizada con éxito');
          emit('companyUpdated'); // Emitir evento para actualizar la lista de empresas
          emit('closeModal'); // Cerrar el modal
        }
      };
  
      onMounted(() => {
        fetchPaisOptions();
        fetchRegionOptions();
      });
  
      return {
        editedCompany,
        paisOptions,
        regionOptions,
        updateCompany,
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
  