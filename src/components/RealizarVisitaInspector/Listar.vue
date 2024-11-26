<template>
  <el-container>
    <el-header>
      <h1>Inspecciones Como Inspector</h1>
    </el-header>
    <el-main>
      <!-- Filtros y Paginación -->
      <el-row>
        <el-col :span="12">
          <el-input v-model="searchQuery" placeholder="Buscar..." @input="handleSearch" />
        </el-col>
        <el-col :span="12" style="text-align: right;">
          <el-pagination
            @current-change="handlePageChange"
            :current-page="currentPage"
            :page-size="pageSize"
            :total="totalRecords"
          />
        </el-col>
      </el-row>

      <!-- Inspecciones -->
      <el-row>
        <el-col :span="24">
          <h2>Inspecciones</h2>
        </el-col>
      </el-row>
      <el-row :gutter="20" v-if="inspections.length > 0">
        <el-col :span="8" v-for="inspection in inspections" :key="inspection.id">
          <el-card shadow="hover">
            <h3>Inspección #{{ inspection.id }}</h3>
            <p><strong>Inicio:</strong> {{ inspection.fecha_hora_inicio }}</p>
            <p><strong>Ubicación:</strong> {{ inspection.ubicacionregistrada }}</p>
            <p><strong>Tipo de Inspección:</strong> {{ inspection.tipo_inspeccion_nombre }}</p>
            <el-button type="primary" @click="goToInspection(inspection.id)">
              Iniciar Inspección
            </el-button>
          </el-card>
        </el-col>
      </el-row>
      <el-row v-else>
        <el-col :span="24">
          <p>No hay inspecciones programadas.</p>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { GetUser } from "@/auth";
import { supabase } from "@/supabase";

export default {
  name: "InspectorInspections",
  setup() {
    const router = useRouter();
    const inspections = ref([]);
    const totalRecords = ref(0);
    const currentPage = ref(1);
    const pageSize = ref(10);
    const searchQuery = ref("");

    const fetchInspections = async () => {
      const userId = GetUser();
      if (!userId) {
        console.error("No se pudo obtener el UUID del usuario.");
        return;
      }

      try {
        const { data, error, count } = await supabase
          .rpc("obtener_inspecciones_asignadas", { p_uuid: userId })
          .range((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value - 1);

        if (error) {
          console.error("Error al obtener inspecciones:", error.message);
        } else {
          inspections.value = data;
          totalRecords.value = count || 0;
        }
      } catch (error) {
        console.error("Error inesperado al obtener inspecciones:", error);
      }
    };

    const handlePageChange = (page) => {
      currentPage.value = page;
      fetchInspections();
    };

    const handleSearch = () => {
      // Espera unos 300 ms antes de ejecutar la búsqueda
      fetchInspections();
    };

    watch([currentPage, pageSize], fetchInspections, { immediate: true });

    const goToInspection = (inspectionId) => {
      router.push(`/operations-assistant-dashboard/realizarinspeccion/${inspectionId}`);
    };

    return {
      inspections,
      totalRecords,
      currentPage,
      pageSize,
      searchQuery,
      handlePageChange,
      handleSearch,
      goToInspection,
    };
  },
};
</script>

<style scoped>
h1 {
  text-align: center;
  margin-bottom: 20px;
}

h2 {
  margin: 20px 0 10px;
}

.el-card {
  margin: 10px 0;
}
</style>