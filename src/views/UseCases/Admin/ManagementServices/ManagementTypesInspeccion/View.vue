<template>
    <div>
      <el-button type="primary" class="neon-button" @click="showCreateDialog = true">Crear Tipo de Inspección</el-button>
  
      <el-dialog v-model="showCreateDialog" title="Crear Tipo de Inspección" :modal-append-to-body="false">
        <CreateInspection @created="handleCreated" />
      </el-dialog>
  
      <ListInspection ref="inspectionList" @edit="handleEdit" @delete="handleDelete" />
  
      <el-dialog v-model="showEditDialog" title="Editar Tipo de Inspección" :modal-append-to-body="false">
        <EditInspection :inspection="selectedInspection" @updated="handleUpdated" />
      </el-dialog>
  
      <el-dialog v-model="showDeleteDialog" title="Eliminar Tipo de Inspección" :modal-append-to-body="false">
        <DeleteInspection :inspectionId="inspectionToDelete.id" @deleted="handleDeleted" />
      </el-dialog>
    </div>
  </template>
  
  <script>
  import CreateInspection from '@/components/ManagementTypesInspeccion/CreateInspection.vue'
  import ListInspection from '@/components/ManagementTypesInspeccion/ListInspection.vue'
  import EditInspection from '@/components/ManagementTypesInspeccion/EditInspection.vue'
  import DeleteInspection from '@/components/ManagementTypesInspeccion/DeleteInspection.vue'
  
  export default {
    components: { CreateInspection, ListInspection, EditInspection, DeleteInspection },
    data() {
      return {
        showCreateDialog: false,
        showEditDialog: false,
        showDeleteDialog: false,
        selectedInspection: null,
        inspectionToDelete: null,
      }
    },
    methods: {
      handleCreated() {
        this.showCreateDialog = false;
        this.$refs.inspectionList.fetchInspections(); // Actualiza la lista después de crear
      },
      handleEdit(inspection) {
        this.selectedInspection = inspection;
        this.showEditDialog = true;
      },
      handleUpdated() {
        this.showEditDialog = false;
        this.$refs.inspectionList.fetchInspections(); // Actualiza la lista después de editar
      },
      handleDelete(inspection) {
        this.inspectionToDelete = inspection;
        this.showDeleteDialog = true;
      },
      handleDeleted() {
        this.showDeleteDialog = false;
        this.$refs.inspectionList.fetchInspections(); // Actualiza la lista después de eliminar
      },
    },
  }
  </script>
  