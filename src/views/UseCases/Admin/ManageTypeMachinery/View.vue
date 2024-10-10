<template>
    <div>
      <el-button type="primary" @click="showCreateDialog = true">Crear Tipo de Maquinaria</el-button>
  
      <CreateMachinery v-if="showCreateDialog" @created="handleCreated" />
  
      <ListMachinery @edit="handleEdit" @delete="handleDelete" />
  
      <EditMachinery v-if="selectedMachinery" :machinery="selectedMachinery" @updated="handleUpdated" />
  
      <DeleteMachinery v-if="machineryToDelete" :maquinariaId="machineryToDelete.id" @deleted="handleDeleted" />
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
        selectedMachinery: null,
        machineryToDelete: null,
      }
    },
    methods: {
      handleCreated(newMachinery) {
        this.showCreateDialog = false
        // Recarga la lista de maquinarias
      },
      handleEdit(maquinaria) {
        this.selectedMachinery = maquinaria
      },
      handleUpdated(updatedMachinery) {
        this.selectedMachinery = null
        // Recarga la lista de maquinarias
      },
      handleDelete(maquinaria) {
        this.machineryToDelete = maquinaria
      },
      handleDeleted() {
        this.machineryToDelete = null
        // Recarga la lista de maquinarias
      },
    },
  }
  </script>
  