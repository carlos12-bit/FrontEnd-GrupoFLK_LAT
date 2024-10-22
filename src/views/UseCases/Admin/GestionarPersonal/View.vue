<template>
  <div>
    <h1>Gestionar Personal</h1>
    <el-button type="primary" @click="abrirCrearDialogo">Crear Certificador</el-button>
    
    <el-table :data="certificadores" style="width: 100%">
      <el-table-column prop="certificado_digital" label="Certificado Digital" />
      <el-table-column prop="numero_certificado" label="Número Certificado" />
      <el-table-column prop="entidad_certificadora" label="Entidad Certificadora" />
      <el-table-column label="Acciones">
        <template #default="scope">
          <el-button type="text" @click="abrirEditarDialogo(scope.row)">Editar</el-button>
          <el-button type="text" @click="eliminarCertificador(scope.row.id)">Eliminar</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="Crear Certificador" :visible.sync="crearDialogoVisible">
      <CrearCertificador @cerrar="cerrarCrearDialogo" @certificadorCreado="cargarCertificadores" />
    </el-dialog>

    <el-dialog title="Editar Certificador" :visible.sync="editarDialogoVisible">
      <EditarCertificador 
        :certificador="certificadorSeleccionado" 
        @cerrar="cerrarEditarDialogo" 
        @certificadorActualizado="cargarCertificadores" 
      />
    </el-dialog>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { supabase } from '@/supabase'; // Asegúrate de que la ruta es correcta
import CrearCertificador from '@/components/GestionarPersonal/CrearCertificador.vue';
import EditarCertificador from '@/components/GestionarPersonal/EditarCertificador.vue';
export default {
  components: {
    CrearCertificador,
    EditarCertificador,
  },
  setup() {
    const certificadores = ref([]);
    const crearDialogoVisible = ref(false);
    const editarDialogoVisible = ref(false);
    const certificadorSeleccionado = ref({});

    const cargarCertificadores = async () => {
      const { data, error } = await supabase.from('certificador').select();
      if (error) {
        console.error('Error al cargar certificadores:', error.message);
        return;
      }
      certificadores.value = data;
    };

    const eliminarCertificador = async (id) => {
      const { error } = await supabase.from('certificador').delete().eq('id', id);
      if (error) {
        console.error('Error al eliminar certificador:', error.message);
        return;
      }
      cargarCertificadores(); // Recargar la lista
    };

    const abrirCrearDialogo = () => {
      crearDialogoVisible.value = true;
    };

    const cerrarCrearDialogo = () => {
      crearDialogoVisible.value = false;
    };

    const abrirEditarDialogo = (certificador) => {
      certificadorSeleccionado.value = certificador;
      editarDialogoVisible.value = true;
    };

    const cerrarEditarDialogo = () => {
      editarDialogoVisible.value = false;
    };

    onMounted(cargarCertificadores);

    return {
      certificadores,
      crearDialogoVisible,
      abrirCrearDialogo,
      cerrarCrearDialogo,
      abrirEditarDialogo,
      editarDialogoVisible,
      cerrarEditarDialogo,
      certificadorSeleccionado,
      eliminarCertificador,
    };
  },
};
</script>
