<template>
  <div class="edit-empresa-container">
    <el-form
      :model="empresa"
      :rules="rules"
      ref="empresaForm"
      label-width="150px"
      class="form-wrapper"
    >
      <!-- Título -->
      <h3 class="form-title">Editar Empresa</h3>

      <!-- RUC -->
      <el-form-item label="RUC" prop="nro_identificacion">
        <el-input v-model="empresa.nro_identificacion" disabled />
      </el-form-item>

      <!-- Razón Social -->
      <el-form-item label="Razón Social" prop="razon_social">
        <el-input
          v-model="empresa.razon_social"
          placeholder="Ingrese la razón social"
        />
      </el-form-item>

      <!-- Nombre Comercial -->
      <el-form-item label="Nombre Comercial" prop="nombre_comercial">
        <el-input
          v-model="empresa.nombre_comercial"
          placeholder="Ingrese el nombre comercial"
        />
      </el-form-item>

      <!-- Dirección Central -->
      <el-form-item label="Dirección Central" prop="direccion_central">
        <el-input
          v-model="empresa.direccion_central"
          placeholder="Ingrese la dirección central"
        />
      </el-form-item>

      <!-- País -->
      <el-form-item label="País" prop="pais_id">
        <el-select v-model="empresa.pais_id" placeholder="Seleccione un país">
          <el-option
            v-for="pais in paises"
            :key="pais.id"
            :label="pais.nombre"
            :value="pais.id"
          />
        </el-select>
      </el-form-item>

      <!-- Botones de acción -->
      <div class="form-actions">
        <el-button
          type="primary"
          :loading="loading"
          @click="saveEmpresa"
          icon="el-icon-check"
        >
          Guardar Cambios
        </el-button>
        <el-button @click="$emit('closeModal')" icon="el-icon-close">
          Cancelar
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { reactive, ref, watch } from 'vue';
import { ElMessage } from 'element-plus'; // Importación de ElMessage
import supabase from '@/supabase';

export default {
  props: {
    empresaInicial: {
      type: Object,
      required: true,
    },
  },
  emits: ['closeModal', 'refreshTable'],
  setup(props, { emit }) {
    const empresa = reactive({ ...props.empresaInicial }); // Clonación reactiva de datos
    const empresaForm = ref(null);
    const loading = ref(false);
    const paises = ref([]);

    // Reglas de validación
    const rules = {
      razon_social: [
        { required: true, message: 'La razón social es obligatoria.', trigger: 'blur' },
      ],
      nombre_comercial: [
        { required: true, message: 'El nombre comercial es obligatorio.', trigger: 'blur' },
      ],
      direccion_central: [
        { required: true, message: 'La dirección central es obligatoria.', trigger: 'blur' },
      ],
      pais_id: [
        { required: true, message: 'Seleccione un país.', trigger: 'change' },
      ],
    };

    // Obtener la lista de países
    const fetchPaises = async () => {
      try {
        const { data, error } = await supabase.from('pais').select('id, nombre');
        if (error) throw error;
        paises.value = data || [];
      } catch (err) {
        console.error('Error al obtener los países:', err.message);
      }
    };

    // Guardar cambios en la empresa
    const saveEmpresa = async () => {
      if (!empresaForm.value) return;

      try {
        await empresaForm.value.validate();

        loading.value = true;

        const { error } = await supabase
          .from('empresa')
          .update({
            razon_social: empresa.razon_social,
            nombre_comercial: empresa.nombre_comercial,
            direccion_central: empresa.direccion_central,
            pais_id: empresa.pais_id,
            fecha_de_modificacion: new Date().toISOString(),
          })
          .eq('id', empresa.id);

        if (error) throw error;

        ElMessage.success('Empresa actualizada correctamente.');
        emit('refreshTable');
        emit('closeModal');
      } catch (err) {
        console.error('Error al actualizar la empresa:', err.message || err);
        ElMessage.error('Hubo un problema al actualizar la empresa.');
      } finally {
        loading.value = false;
      }
    };

    // Cargar países al montar el componente
    fetchPaises();

    return {
      empresa,
      empresaForm,
      rules,
      saveEmpresa,
      paises,
      loading,
    };
  },
};
</script>

<style scoped>
.edit-empresa-container {
  background: #ffffff;
  border-radius: 10px;
  padding: 20px;
  max-width: 600px;
  margin: auto;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.form-wrapper {
  margin: 0;
}

.form-title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.25rem;
  color: #333;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
</style>
