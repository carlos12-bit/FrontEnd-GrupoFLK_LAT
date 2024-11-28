<template>
  <el-form :model="editedInspection" ref="inspectionForm" label-width="150px">
    <el-form-item label="ID del Inspector" prop="inspector_id">
      <el-input v-model="editedInspection.inspector_id" placeholder="Ingrese el ID del inspector" />
    </el-form-item>
    <el-form-item label="ID del Certificador" prop="certificador_id">
      <el-input v-model="editedInspection.certificador_id" placeholder="Ingrese el ID del certificador" />
    </el-form-item>
    <el-form-item label="ID de Maquinaria" prop="maquinariaxrepresentante_de_empresa_id">
      <el-input v-model="editedInspection.maquinariaxrepresentante_de_empresa_id" placeholder="Ingrese el ID de la maquinaria" />
    </el-form-item>
    <el-form-item label="Fecha y Hora Inicio" prop="fecha_hora_inicio">
      <el-date-picker
        v-model="editedInspection.fecha_hora_inicio"
        type="datetime"
        placeholder="Seleccione fecha y hora de inicio"
      />
    </el-form-item>
    <el-form-item label="Ubicación Registrada" prop="ubicacionregistrada">
      <el-input v-model="editedInspection.ubicacionregistrada" placeholder="Ingrese la ubicación registrada" />
    </el-form-item>
    <el-form-item label="Estado" prop="Estado">
      <el-input v-model="editedInspection.Estado" placeholder="Ingrese el estado" />
    </el-form-item>
    <el-button type="primary" @click="submitEdit">Guardar Cambios</el-button>
    <el-button @click="$emit('closeModal')">Cancelar</el-button>
  </el-form>
</template>

<script>
import { ref, watch } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import supabase from '@/supabase';
import { GetUser } from '@/auth';

export default {
  props: {
    inspeccion: {
      type: Object,
      required: true,
    },
  },
  emits: ['closeModal', 'refreshTable'],
  setup(props, { emit }) {
    const editedInspection = ref({});

    // Sincronizar datos de la inspección seleccionada con el formulario
    watch(
      () => props.inspeccion,
      (newVal) => {
        if (newVal) {
          editedInspection.value = { ...newVal };
        }
      },
      { immediate: true }
    );

    const validarConflictos = async () => {
      const inspectorId = editedInspection.value.inspector_id;
      const certificadorId = editedInspection.value.certificador_id;
      const fechaInicio = new Date(editedInspection.value.fecha_hora_inicio);

      // Verificar horarios de inspecciones existentes para el inspector
      const { data: inspectorInspections, error: inspectorError } = await supabase.rpc(
        'fetch_fechas_por_inspector',
        { p_inspector_id: inspectorId }
      );
      if (inspectorError) throw inspectorError;

      // Verificar horarios de inspecciones existentes para el certificador
      const { data: certificadorInspections, error: certificadorError } = await supabase.rpc(
        'fetch_fechas_por_certificador',
        { p_certificador_id: certificadorId }
      );
      if (certificadorError) throw certificadorError;

      const duracionHoras = 4; // Duración estimada de la inspección
      const fechaFin = new Date(fechaInicio);
      fechaFin.setHours(fechaInicio.getHours() + duracionHoras);

      const hayConflictos = (inspections) =>
        inspections.some((insp) => {
          const inicioExistente = new Date(insp.fecha_hora_inicio);
          const finExistente = new Date(inicioExistente);
          finExistente.setHours(finExistente.getHours() + duracionHoras);
          return (
            (fechaInicio >= inicioExistente && fechaInicio < finExistente) ||
            (fechaFin > inicioExistente && fechaFin <= finExistente) ||
            (fechaInicio <= inicioExistente && fechaFin >= finExistente)
          );
        });

      if (hayConflictos(inspectorInspections)) {
        await ElMessageBox.alert(
          'El horario seleccionado se cruza con otra inspección asignada al inspector.',
          'Conflicto detectado',
          { type: 'warning' }
        );
        return true;
      }

      if (hayConflictos(certificadorInspections)) {
        await ElMessageBox.alert(
          'El horario seleccionado se cruza con otra inspección asignada al certificador.',
          'Conflicto detectado',
          { type: 'warning' }
        );
        return true;
      }

      return false;
    };

    const submitEdit = async () => {
      try {
        if (!editedInspection.value.fecha_hora_inicio || !editedInspection.value.ubicacionregistrada) {
          ElMessage({
            message: 'Todos los campos requeridos deben estar completos.',
            type: 'warning',
          });
          return;
        }

        const hayConflictos = await validarConflictos();
        if (hayConflictos) return;

        editedInspection.value.fecha_de_modificacion = new Date().toISOString();
        editedInspection.value.ultimo_autor = GetUser();

        const { error } = await supabase
          .from('inspeccion')
          .update(editedInspection.value)
          .eq('id', editedInspection.value.id);

        if (error) throw error;

        ElMessage({
          message: 'Inspección actualizada correctamente.',
          type: 'success',
        });

        emit('refreshTable');
        emit('closeModal');
      } catch (err) {
        ElMessage({
          message: `Error al actualizar la inspección: ${err.message}`,
          type: 'error',
        });
      }
    };

    return { editedInspection, submitEdit };
  },
};
</script>