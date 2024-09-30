<<template>
  <div class="container mt-5">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3>Tipos de Inspección</h3>
      <button @click="abrirFormulario" class="btn btn-success">Registrar Tipo de Inspección</button>
    </div>

    <div class="table-responsive">
      <table id="inspection-types-table" class="table table-hover table-bordered dt-responsive nowrap">
        <thead class="table-light">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Fecha de Creación</th>
            <th>Fecha de Modificación</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tipo in tiposInspeccion" :key="tipo.id">
            <td>{{ tipo.id }}</td>
            <td>{{ tipo.Nombre }}</td>
            <td>{{ tipo.descripcion }}</td>
            <td>{{ new Date(tipo.fecha_de_creacion).toLocaleDateString() }}</td>
            <td>{{ new Date(tipo.fecha_de_modificacion).toLocaleDateString() }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Modal for Registering New Inspection Type -->
  <create-modal v-if="showModal" @close="showModal = false" @save="onCreateSuccess" />
</template>

<script>
import { ref, onMounted } from 'vue';
import { supabase } from '@/supabase'; // Importa tu cliente Supabase
import CreateModal from '@/components/ManageInspectionTypes/Create.vue'; // Importa el componente de creación
import 'datatables.net-bs5';
import 'datatables.net-responsive-bs5';

export default {
  components: {
    CreateModal,
  },
  setup() {
    const tiposInspeccion = ref([]);
    const showModal = ref(false); // Control para mostrar el modal de creación

    const fetchTiposInspeccion = async () => {
      let { data: tipo_inspeccion, error } = await supabase.from('tipo_inspeccion').select('*');
      if (!error) {
        tiposInspeccion.value = tipo_inspeccion;
      } else {
        console.error(error);
      }
    };

    const abrirFormulario = () => {
      showModal.value = true; // Mostrar modal de creación
    };

    const onCreateSuccess = async () => {
      showModal.value = false; // Cerrar modal
      await fetchTiposInspeccion(); // Recargar datos
      $('#inspection-types-table').DataTable().ajax.reload(); // Recargar DataTables si es necesario
    };

    onMounted(async () => {
      await fetchTiposInspeccion();
      $(document).ready(function () {
        $('#inspection-types-table').DataTable({
          responsive: true,
          searching: true, // Habilitar la barra de búsqueda
          paging: true, // Habilitar paginación
          ordering: true, // Habilitar ordenamiento
        });
      });
    });

    return {
      tiposInspeccion,
      showModal,
      abrirFormulario,
      onCreateSuccess,
    };
  },
};
</script>

<style scoped>
/* Estilos para mejorar la apariencia de la tabla y hacerla más responsiva */
.table {
  width: 100%;
  text-align: center;
}

.table th {
  background-color: #f8f9fa;
  font-weight: bold;
}

.table-hover tbody tr:hover {
  background-color: #f1f1f1;
}

/* Botón personalizado */
.btn-success {
  background-color: #28a745;
  border-color: #28a745;
}

@media (max-width: 768px) {
  .table-responsive {
    margin: 0;
    padding: 0;
  }
}
</style>>