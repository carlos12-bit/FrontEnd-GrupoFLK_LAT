<template>
  <el-form :model="newInspection" ref="inspectionForm" label-width="200px">
    <!-- Selección de Empresa -->
    <el-form-item label="Empresa" prop="empresa_id">
      <el-select v-model="selectedEmpresaId" placeholder="Seleccione una empresa" @change="fetchRepresentantes">
        <el-option v-for="empresa in empresas" :key="empresa.id" :label="empresa.nombre_comercial" :value="empresa.id" />
      </el-select>
    </el-form-item>

    <!-- Selección de Representante -->
    <el-form-item label="Representante de Empresa" prop="representante_id">
      <el-select v-model="selectedRepresentanteId" placeholder="Seleccione un representante" @change="fetchMaquinarias">
        <el-option
          v-for="representante in representantes"
          :key="representante.id"
          :label="`${representante.nombre} ${representante.apellido_paterno} ${representante.apellido_materno}`"
          :value="representante.id"
        />
      </el-select>
    </el-form-item>

    <!-- Selección de Maquinaria -->
    <el-form-item label="Maquinaria" prop="maquinariaxrepresentante_de_empresa_id">
      <el-select v-model="newInspection.maquinariaxrepresentante_de_empresa_id" placeholder="Seleccione una maquinaria" @change="handleMaquinariaChange">
        <el-option v-for="maquinaria in maquinarias" :key="maquinaria.id" :label="`${maquinaria.descripcion} - ${maquinaria.placa}`" :value="maquinaria.id" />
      </el-select>
    </el-form-item>

    <!-- Fecha y Hora de Inicio -->
    <el-form-item label="Fecha y Hora de Inicio" prop="fecha_hora_inicio">
      <el-date-picker v-model="newInspection.fecha_hora_inicio" type="datetime" placeholder="Seleccionar fecha y hora de inicio" />
    </el-form-item>

    <!-- Fecha y Hora de Fin -->
    <el-form-item label="Fecha y Hora de Fin" prop="fecha_hora_fin">
      <el-date-picker v-model="newInspection.fecha_hora_fin" type="datetime" placeholder="Seleccionar fecha y hora de fin" />
    </el-form-item>

    <!-- Ubicación Registrada -->
    <el-form-item label="Ubicación Registrada" prop="ubicacionregistrada">
      <el-input v-model="newInspection.ubicacionregistrada" />
    </el-form-item>

    <!-- Selección de Tipo de Inspección -->
    <el-form-item label="Tipo de Inspección" prop="tipo_de_inspeccion">
      <el-select v-model="newInspection.tipo_de_inspeccion" placeholder="Seleccione un tipo de inspección" @change="fetchInspectoresCertificadores">
        <el-option v-for="tipo in tiposDeInspeccion" :key="tipo.id" :label="tipo.nombre" :value="tipo.id" />
      </el-select>
    </el-form-item>

    <!-- Selección de Inspector -->
    <el-form-item label="Inspector" prop="inspector_id" :rules="[{ validator: validateInspectorCertificador, message: 'Inspector y certificador no pueden ser la misma persona', trigger: 'change' }]">
      <el-select v-model="newInspection.inspector_id" placeholder="Seleccione un inspector">
        <el-option v-for="inspector in inspectores" :key="inspector.id" :label="`${inspector.nombre} ${inspector.apellido_paterno} ${inspector.apellido_materno}`" :value="inspector.id" />
      </el-select>
    </el-form-item>

    <!-- Selección de Certificador -->
    <el-form-item label="Certificador" prop="certificador_id" :rules="[{ validator: validateInspectorCertificador, message: 'Inspector y certificador no pueden ser la misma persona', trigger: 'change' }]">
      <el-select v-model="newInspection.certificador_id" placeholder="Seleccione un certificador">
        <el-option v-for="certificador in certificadores" :key="certificador.id" :label="`${certificador.nombre} ${certificador.apellido_paterno} ${certificador.apellido_materno}`" :value="certificador.id" />
      </el-select>
    </el-form-item>

    <!-- Botones de Acción -->
    <el-button type="primary" @click="submitInspection">Registrar</el-button>
    <el-button @click="$emit('closeModal')">Cancelar</el-button>
  </el-form>
</template>

<script>
import { ref, onMounted } from 'vue';
import supabase from '@/supabase';
import { GetUser } from '@/auth';

export default {
  emits: ['closeModal', 'refreshTable'],
  setup(_, { emit }) {
    const newInspection = ref({
      maquinariaxrepresentante_de_empresa_id: null,
      inspector_id: null,
      certificador_id: null,
      fecha_hora_inicio: null,
      fecha_hora_fin: null,
      ubicacionregistrada: '',
      "Estado": 'registrado', // Estado predeterminado como "Registrado"
      tipo_de_inspeccion: null,
      autor: null,
      ultimo_autor: null,
      fecha_de_creacion: null,
      fecha_de_modificacion: null,
    });

    const selectedEmpresaId = ref(null);
    const selectedRepresentanteId = ref(null);
    const empresas = ref([]);
    const representantes = ref([]);
    const maquinarias = ref([]);
    const tiposDeInspeccion = ref([]);
    const inspectores = ref([]);
    const certificadores = ref([]);

    const fetchEmpresas = async () => {
      const { data, error } = await supabase.from('empresa').select('id, nombre_comercial').eq('Estado', true);
      if (error) {
        console.error('Error al obtener empresas:', error.message);
      } else {
        empresas.value = data;
      }
    };

    const fetchRepresentantes = async () => {
      representantes.value = [];
      maquinarias.value = [];
      if (selectedEmpresaId.value) {
        const { data, error } = await supabase.rpc('fetch_representantes_por_empresa', { p_empresa_id: selectedEmpresaId.value });
        if (error) {
          console.error('Error al obtener representantes:', error.message);
        } else {
          representantes.value = data;
        }
      }
    };

    const fetchMaquinarias = async () => {
      maquinarias.value = [];
      if (selectedRepresentanteId.value) {
        const { data, error } = await supabase.rpc('fetch_maquinarias_por_representante', { p_representante_id: selectedRepresentanteId.value });
        if (error) {
          console.error('Error al obtener maquinarias:', error.message);
        } else {
          maquinarias.value = data;
        }
      }
    };

    const fetchTiposDeInspeccion = async (tipoDeMaquinariaId) => {
      const { data, error } = await supabase.rpc('fetch_tipos_de_inspeccion_por_maquinaria', { p_tipo_de_maquinaria_id: tipoDeMaquinariaId });
      if (error) {
        console.error('Error al obtener tipos de inspección:', error.message);
      } else {
        tiposDeInspeccion.value = data;
      }
    };

    const fetchInspectoresCertificadores = async () => {
      if (newInspection.value.tipo_de_inspeccion) {
        const tipoDeInspeccionId = newInspection.value.tipo_de_inspeccion;

        // Fetch Inspectores
        const { data: inspectoresData, error: inspectoresError } = await supabase.rpc('fetch_inspectores_por_tipo_inspeccion', { p_tipo_de_inspeccion_id: tipoDeInspeccionId });
        if (inspectoresError) {
          console.error('Error al obtener inspectores:', inspectoresError.message);
        } else {
          inspectores.value = inspectoresData;
        }

        // Fetch Certificadores
        const { data: certificadoresData, error: certificadoresError } = await supabase.rpc('fetch_certificadores_por_tipo_inspeccion', { p_tipo_de_inspeccion_id: tipoDeInspeccionId });
        if (certificadoresError) {
          console.error('Error al obtener certificadores:', certificadoresError.message);
        } else {
          certificadores.value = certificadoresData;
        }
      }
    };

    const handleMaquinariaChange = () => {
      const selectedMaquinaria = maquinarias.value.find(
        (maquinaria) => maquinaria.id === newInspection.value.maquinariaxrepresentante_de_empresa_id
      );

      if (selectedMaquinaria) {
        fetchTiposDeInspeccion(selectedMaquinaria.tipo_de_maquinaria_id);
      }
    };

    const validateInspectorCertificador = (rule, value, callback) => {
      if (newInspection.value.inspector_id === newInspection.value.certificador_id) {
        callback(new Error('El inspector y el certificador no pueden ser la misma persona'));
      } else {
        callback();
      }
    };

    const submitInspection = async () => {
      const userId = GetUser();
      newInspection.value.autor = userId;
      newInspection.value.ultimo_autor = userId;
      newInspection.value.fecha_de_creacion = new Date().toISOString();
      newInspection.value.fecha_de_modificacion = new Date().toISOString();

      const { error } = await supabase.from('inspeccion').insert([newInspection.value]);
      if (error) {
        console.error('Error al registrar inspección:', error.message);
      } else {
        emit('refreshTable');
        emit('closeModal');
      }
    };

    onMounted(() => {
      fetchEmpresas();
    });

    return {
      newInspection,
      selectedEmpresaId,
      selectedRepresentanteId,
      empresas,
      representantes,
      maquinarias,
      tiposDeInspeccion,
      inspectores,
      certificadores,
      fetchRepresentantes,
      fetchMaquinarias,
      fetchTiposDeInspeccion,
      fetchInspectoresCertificadores,
      handleMaquinariaChange,
      validateInspectorCertificador,
      submitInspection,
    };
  },
};
</script>