<template>
  <el-form :model="editedInspection" ref="inspectionForm" label-width="120px">
    <el-form-item label="ID del Inspector" prop="inspector_id">
      <el-input v-model="editedInspection.inspector_id" />
    </el-form-item>
    <el-form-item label="ID del Certificador" prop="certificador_id">
      <el-input v-model="editedInspection.certificador_id" />
    </el-form-item>
    <el-form-item label="ID de Maquinaria" prop="maquinariaxrepresentante_de_empresa_id">
      <el-input v-model="editedInspection.maquinariaxrepresentante_de_empresa_id" />
    </el-form-item>
    <el-form-item label="Fecha y Hora Asignada" prop="fecha_hora_asignada">
      <el-date-picker v-model="editedInspection.fecha_hora_asignada" type="datetime" placeholder="Seleccionar fecha y hora" />
    </el-form-item>
    <el-form-item label="Ubicación Registrada" prop="ubicacionregistrada">
      <el-input v-model="editedInspection.ubicacionregistrada" />
    </el-form-item>
    <el-form-item label="Estado" prop="Estado">
      <el-input v-model="editedInspection.Estado" />
    </el-form-item>
    <el-form-item label="Tipo de Inspección" prop="tipo_de_inspeccion">
      <el-input v-model="editedInspection.tipo_de_inspeccion" />
    </el-form-item>
    <el-button type="primary" @click="submitEdit">Guardar Cambios</el-button>
    <el-button @click="$emit('closeModal')">Cancelar</el-button>
  </el-form>
</template>

<script>
import { ref, watch } from 'vue';
import { GetUser } from '@/auth';
import supabase from '@/supabase';

export default {
  props: ['inspeccion'],
  emits: ['closeModal', 'refreshTable'],
  setup(props, { emit }) {
    const editedInspection = ref({ ...props.inspeccion });

    watch(
      () => props.inspeccion,
      (newVal) => {
        editedInspection.value = { ...newVal };
      }
    );

    const submitEdit = async () => {
      editedInspection.value.fecha_de_modificacion = new Date().toISOString();
      editedInspection.value.ultimo_autor = GetUser();

      const { error } = await supabase
        .from('inspeccion')
        .update(editedInspection.value)
        .eq('id', editedInspection.value.id);

      if (error) {
        console.error('Error al editar inspección:', error.message);
      } else {
        emit('refreshTable');
        emit('closeModal');
      }
    };

    return { editedInspection, submitEdit };
  },
};
</script>
