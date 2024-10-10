<template>
  <div>
    <el-button type="primary" class="neon-button" @click="showCreateDialog = true">Crear Tipo de Maquinaria</el-button>

    <el-dialog v-model="showCreateDialog" title="Crear Tipo de Maquinaria" :modal-append-to-body="false">
      <CreateMachinery @created="handleCreated" />
    </el-dialog>

    <ListMachinery ref="machineryList" @edit="handleEdit" @delete="handleDelete" />

    <el-dialog v-model="showEditDialog" title="Editar Tipo de Maquinaria" :modal-append-to-body="false">
      <EditMachinery :machinery="selectedMachinery" @updated="handleUpdated" />
    </el-dialog>

    <el-dialog v-model="showDeleteDialog" title="Eliminar Tipo de Maquinaria" :modal-append-to-body="false">
      <DeleteMachinery :maquinariaId="machineryToDelete.id" @deleted="handleDeleted" />
    </el-dialog>
  </div>
</template>

<script>
import CreateMachinery from '@/components/ManageTypeMachinery/CreateMachinery.vue'
import ListMachinery from '@/components/ManageTypeMachinery/ListMachinery.vue'
import EditMachinery from '@/components/ManageTypeMachinery/EditMachinery.vue'
import DeleteMachinery from '@/components/ManageTypeMachinery/DeleteMachinery.vue'

export default {
  components: { CreateMachinery, ListMachinery, EditMachinery, DeleteMachinery },
  data() {
    return {
      showCreateDialog: false,
      showEditDialog: false,
      showDeleteDialog: false,
      selectedMachinery: null,
      machineryToDelete: null,
    }
  },
  methods: {
    handleCreated() {
      this.showCreateDialog = false;
      this.$refs.machineryList.fetchMachineries(); // Actualiza la lista después de crear
    },
    handleEdit(maquinaria) {
      this.selectedMachinery = maquinaria;
      this.showEditDialog = true;
    },
    handleUpdated() {
      this.showEditDialog = false;
      this.$refs.machineryList.fetchMachineries(); // Actualiza la lista después de editar
    },
    handleDelete(maquinaria) {
      this.machineryToDelete = maquinaria;
      this.showDeleteDialog = true;
    },
    handleDeleted() {
      this.showDeleteDialog = false;
      this.$refs.machineryList.fetchMachineries(); // Actualiza la lista después de eliminar
    },
  },
}
</script>