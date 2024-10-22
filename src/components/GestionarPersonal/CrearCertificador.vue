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
        <el-button type="primary" @click="crearCertificador">Crear</el-button>
        <el-button @click="$emit('cerrar')">Cancelar</el-button>
      </el-form-item>
    </el-form>
    <p v-if="mensaje">{{ mensaje }}</p>
  </div>
</template>

<script>
import { ref } from 'vue';
import { supabase } from '@/supabase';
import { GetUser } from '@/auth'; // Asegúrate de que la función GetUser esté exportada

export default {
  setup(props, { emit }) {
    const certificador = ref({
      asistente_de_operaciones_id: null,
      certificado_digital: '',
      numero_certificado: '',
      entidad_certificadora: '',
      tipo_inspeccion_id: null,
      fecha_de_emision_de_certificado: '',
      fecha_de_caducidad_de_certificado: '',
      fecha_de_creacion: new Date().toISOString(),
      fecha_de_modificacion: null,
      autor: '',
      ultimo_autor: '',
    });

    const mensaje = ref('');

    const crearCertificador = async () => {
      try {
        const usuario = GetUser(); // Obtener el usuario logueado
        certificador.value.autor = usuario.id; // Asignar autor
        certificador.value.ultimo_autor = usuario.id; // Asignar último autor

        const { error } = await supabase.from('certificador').insert([certificador.value]);

        if (error) throw error;

        mensaje.value = 'Certificador creado exitosamente';
        emit('certificadorCreado');
        emit('cerrar'); // Cerrar el diálogo
      } catch (error) {
        console.error('Error al crear certificador:', error.message);
        mensaje.value = 'Error al crear certificador';
      }
    };

    return {
      certificador,
      crearCertificador,
      mensaje,
    };
  },
};
</script>
