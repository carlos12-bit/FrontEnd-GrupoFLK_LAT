<template>
  <div>
    <el-form ref="companyForm" label-width="120px" class="company-form">
      <el-form-item label="Número de Identificación (RUC)">
        <el-input v-model="company.nro_identificacion" placeholder="Ingrese RUC de la empresa" />
      </el-form-item>

      <el-form-item label="Nombre Comercial">
        <el-input v-model="company.nombre_comercial" placeholder="Ingrese nombre comercial" />
      </el-form-item>
      
      <el-form-item label="Razón Social">
        <el-input v-model="company.razon_social" placeholder="Ingrese razón social" />
      </el-form-item>

      <el-form-item label="Dirección Central">
        <el-input v-model="company.direccion_central" placeholder="Ingrese dirección central" />
      </el-form-item>

      <el-form-item label="País">
        <el-select v-model="company.pais_id" placeholder="Seleccione un país">
          <el-option v-for="pais in paisOptions" :key="pais.id" :label="pais.nombre" :value="pais.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="Estado">
        <el-switch v-model="company.estado" active-text="Activo" inactive-text="Inactivo" />
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
      nro_identificacion: '',
      nombre_comercial: '',
      razon_social: '',
      direccion_central: '',
      pais_id: null,
      fecha_de_creacion: new Date().toISOString(),
      fecha_de_modificacion: new Date().toISOString(),
      autor: GetUser(),
      ultimo_autor: GetUser(),
      estado: true, // Activo por defecto
    });

    const paisOptions = ref([]);

    // Cargar opciones de país desde la base de datos
    const fetchPaisOptions = async () => {
      const { data, error } = await supabase.from('pais').select('id, nombre');
      if (error) {
        console.error('Error al obtener países:', error.message);
      } else {
        paisOptions.value = data;
        console.log("Países obtenidos:", paisOptions.value); // Verificar que se obtienen los países
      }
    };

    // Función para registrar la empresa en la base de datos
    const registerCompany = async () => {
      if (!company.value.nro_identificacion || !company.value.nombre_comercial || !company.value.razon_social || !company.value.pais_id) {
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
    });

    return {
      company,
      paisOptions,
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