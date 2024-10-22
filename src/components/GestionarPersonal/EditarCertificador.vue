<template>
  <div>
    <el-form :model="certificador" label-width="200px">
      <el-form-item label="Certificado Digital:">
        <el-input v-model="certificador.certificado_digital" required />
      </el-form-item>
      <el-form-item label="Número Certificado:">
        <el-input v-model="certificador.numero_certificado" required />
      </el-form-item>
      <el-form-item label="Entidad Certificadora:">
        <el-input v-model="certificador.entidad_certificadora" required />
      </el-form-item>
      <el-form-item label="Tipo Inspección ID:">
        <el-input type="number" v-model="certificador.tipo_inspeccion_id" required />
      </el-form-item>
      <el-form-item label="Fecha de Emisión:">
        <el-date-picker v-model="certificador.fecha_de_emision_de_certificado" required />
      </el-form-item>
      <el-form-item label="Fecha de Caducidad:">
        <el-date-picker v-model="certificador.fecha_de_caducidad_de_certificado" required />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="editarCertificador">Actualizar</el-button>
        <el-button @click="$emit('cerrar')">Cancelar</el-button>
      </el-form-item>
    </el-form>
    <p v-if="mensaje">{{ mensaje }}</p>
  </div>
</template>

<script>
import { ref } from 'vue';
import { supabase } from '../../supabase';
import { GetUser } from '../../auth'; // Asegúrate de que la función GetUser esté exportada

export default {
  props: {
    certificador: Object,
  },
  setup(props, { emit }) {
    const mensaje = ref('');

    const editarCertificador = async () => {
      try {
        const usuario = GetUser(); // Obtener el usuario logueado
        props.certificador.ultimo_autor = usuario.id; // Asignar último autor

        const { error } = await supabase.from('certificador').update(props.certificador).eq('id', props.certificador.id);

        if (error) throw error;

        mensaje.value = 'Certificador actualizado exitosamente';
        emit('certificadorActualizado');
        emit('cerrar'); // Cerrar el diálogo
      } catch (error) {
        console.error('Error al actualizar certificador:', error.message);
        mensaje.value = 'Error al actualizar certificador';
      }
    };

    return {
      editarCertificador,
      mensaje,
    };
  },
};
</script>
