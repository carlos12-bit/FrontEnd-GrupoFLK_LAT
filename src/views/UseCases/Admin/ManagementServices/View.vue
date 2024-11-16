<template> 
  <el-container class="gestion-container">
    <el-main class="main-content">
      <el-row :gutter="20" class="gestion-row" type="flex" justify="space-between" align="top">
        <!-- Gestión Tipos de Inspección -->
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <h1 class="main-header">Gestión de Tipo de Inspección</h1>
          <el-card shadow="hover" class="gestion-card">
            <ListTypeInspeccion />
          </el-card>
        </el-col>

        <!-- Gestión Tipo de Maquinaria -->
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <h1 class="main-header">Gestión Tipo de Maquinaria</h1>
          <el-card shadow="hover" class="gestion-card">
            <ListMachinery />
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import ListTypeInspeccion from '../../../../components/ManagementTypesInspeccion/ListInspection.vue';
import ListMachinery from '../../../../components/ManageTypeMachinery/ListMachinery.vue';
export default {
  components: {
    ListTypeInspeccion,
    ListMachinery,
  },
};
</script>

<style scoped>
/* Contenedor principal */
.gestion-container {
  padding: 20px;
  min-height: 100vh;
  background-color: #f5f7fa; /* Fondo claro para un diseño limpio */
}

/* Estilos para el encabezado */
.main-header {
  text-align: center;
  margin-bottom: 10px;
  font-size: 24px;
  color: #333;
}

/* Estilo para el contenido principal */
.main-content {
  padding: 20px;
}

/* Filas y columnas con margen y espaciado adecuado */
.gestion-row {
  display: flex;
  flex-wrap: wrap; /* Asegura que se ajuste en pantallas pequeñas */
}

/* Tarjetas para cada sección */
.gestion-card {
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  transition: box-shadow 0.3s ease;
}

.gestion-card:hover {
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

/* Media queries para ajustar el espaciado en pantallas más pequeñas */
@media screen and (max-width: 768px) {
  .main-header {
    font-size: 20px;
    padding: 10px;
  }
  .gestion-card {
    padding: 15px;
  }
}
</style>
