<template>
  <div class="container mt-5">
    <!-- Título de la vista -->
    <div class="text-center mb-5">
      <h1>Gestión de Servicios</h1>
      <p class="lead">Crea, edita o elimina servicios utilizando el panel de administración.</p>
    </div>

    <!-- Sección de creación de servicios -->
    <div class="row mb-5">
      <div class="col-md-12">
        <Create />
      </div>
    </div>

    <!-- Sección de listado de servicios con DataTable -->
    <div class="row">
      <div class="col-md-12">
        <List />
      </div>
    </div>
  </div>
</template>

<script>
import Create from '@/components/ManagementServices/Create.vue';
import List from '@/components/ManagementServices/List.vue';

export default {
  components: {
    Create,
    List,
  },
};
</script>

<style scoped>
.container {
  max-width: 1000px;
  margin: 0 auto;
}

.text-center {
  text-align: center;
}

.lead {
  font-size: 1.25rem;
  font-weight: 300;
  margin-bottom: 1.5rem;
}

.mt-5 {
  margin-top: 3rem;
}

.mb-5 {
  margin-bottom: 3rem;
}
</style>
