<template>
  <div>
    <List @showCreateForm="showCreateForm" />
    <Create v-if="isCreateFormVisible" @refreshData="refreshData" @closeCreateForm="closeCreateForm" />
  </div>
</template>

<script>
import List from '@/components/ManagementServices/List.vue';
import Create from '@/components/ManagementServices/Create.vue';

export default {
  components: {
    List,
    Create,
  },
  data() {
    return {
      isCreateFormVisible: false,
    };
  },
  methods: {
    showCreateForm() {
      this.isCreateFormVisible = true;
    },
    closeCreateForm() {
      this.isCreateFormVisible = false;
    },
    refreshData() {
      this.$refs.list.fetchData();
    },
  },
};
</script>

<style scoped>
/* Agrega estilos globales aquí */
</style>
