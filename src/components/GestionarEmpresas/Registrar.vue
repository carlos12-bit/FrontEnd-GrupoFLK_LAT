<template>
  <div>
    <el-form ref="companyForm" label-width="120px" class="company-form">
      <el-form-item label="RUC de la Empresa">
        <el-input v-model="company.ruc" placeholder="Ingrese RUC de la empresa" />
      </el-form-item>
      
      <el-form-item label="Nombre Comercial">
        <el-input v-model="company.nombre_comercial" placeholder="Ingrese nombre comercial" />
      </el-form-item>
      
      <el-form-item label="Razón Social">
        <el-input v-model="company.razon_social" placeholder="Ingrese razón social" />
      </el-form-item>
      
      <el-form-item label="País">
        <el-select v-model="company.pais_id" placeholder="Seleccione un país">
          <el-option v-for="pais in paisOptions" :key="pais.id" :label="pais.nombre" :value="pais.id" />
        </el-select>
      </el-form-item>
      
      <el-form-item label="Región">
        <el-select v-model="company.region_id" placeholder="Seleccione una región">
          <el-option v-for="region in regionOptions" :key="region.id" :label="region.nombre" :value="region.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="Dirección Central">
        <el-input v-model="company.direccion_central" placeholder="Ingrese dirección central" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="registerCompany">Registrar</el-button>
        <el-button @click="$emit('closeModal')">Cancelar</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import supabase from '@/supabase';
import { GetUser } from '@/auth';

export default {
  setup(_, { emit }) {
    const company = ref({
      ruc: '',
      nombre_comercial: '',
      razon_social: '',
      pais_id: null,
      region_id: null,
      direccion_central: '',
      autor: GetUser(),
      ultimo_autor: GetUser(),
    });

    const paisOptions = ref([]);
    const regionOptions = ref([]);

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

    // Función para registrar la empresa en la base de datos
    const registerCompany = async () => {
      if (!company.value.ruc || !company.value.nombre_comercial || !company.value.razon_social || !company.value.pais_id || !company.value.region_id) {
        alert('Por favor complete todos los campos');
        return;
      }

      const { error } = await supabase.from('empresa').insert([company.value]);

      if (error) {
        console.error('Error al registrar la empresa:', error.message);
        alert(`Error al registrar la empresa: ${error.message}`);
      } else {
        alert('Empresa registrada exitosamente');
        emit('refreshTable'); // Emitir evento para actualizar la tabla de empresas
        emit('closeModal'); // Emitir evento para cerrar el modal
      }
    };

    onMounted(() => {
      fetchPaisOptions();
      fetchRegionOptions();
    });

    return {
      company,
      paisOptions,
      regionOptions,
      registerCompany,
    };
  },
};
</script>

<style scoped>
.company-form {
  max-width: 400px;
  margin: auto;
}
</style>
