<template>
  <div class="container">
    <h1>Consulta de Inspecciones</h1>
    <div class="form-group">
      <label for="ruc">Ingrese el RUC de la Empresa</label>
      <input
        type="text"
        id="ruc"
        v-model="ruc"
        placeholder="RUC de la Empresa"
        class="input"
      />
      <button @click="fetchInspections" class="btn">Buscar</button>
    </div>

    <div v-if="inspecciones.length">
      <h2>Inspecciones Encontradas</h2>
      <table class="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Placa</th>
            <th>Tipo de Inspección</th>
            <th>Inspector</th>
            <th>Certificador</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(inspeccion, index) in inspecciones" :key="inspeccion.id">
            <td>{{ index + 1 }}</td>
            <td>{{ inspeccion.fecha_hora }}</td>
            <td>{{ inspeccion.estado }}</td>
            <td>{{ inspeccion.placa }}</td>
            <td>{{ inspeccion.tipo_inspeccion }}</td>
            <td>
              {{ inspeccion.inspector_nombre }} {{ inspeccion.inspector_apellido }}
            </td>
            <td>
              {{ inspeccion.certificador_nombre }} {{ inspeccion.certificador_apellido }}
            </td>
            <td>
              <button class="btn-preview" @click="showPreview(inspeccion)">
                Ver Certificado
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
    </div>
    <div v-else>
      <p>No se encontraron inspecciones para el RUC ingresado.</p>
    </div>

    <!-- Modal de Vista Previa -->
    <div v-if="selectedInspection" class="preview-modal">
      <div class="preview-content">
        <h1>Certificado de Inspección</h1>
        <p><strong>Razón Social:</strong> {{ selectedInspection.empresa_razon_social }}</p>
        <p><strong>Nombre Comercial:</strong> {{ selectedInspection.empresa_nombre_comercial }}</p>
        <p><strong>Dirección Central:</strong> {{ selectedInspection.direccion_central }}</p>
        <p><strong>Placa:</strong> {{ selectedInspection.placa }}</p>
        <p><strong>Tipo de Inspección:</strong> {{ selectedInspection.tipo_inspeccion }}</p>
        <p><strong>Estado:</strong> {{ selectedInspection.estado }}</p>
        <p><strong>Inspector:</strong> {{ selectedInspection.inspector_nombre }} {{ selectedInspection.inspector_apellido }}</p>
        <p><strong>Certificador:</strong> {{ selectedInspection.certificador_nombre }} {{ selectedInspection.certificador_apellido }}</p>
        <p><strong>Fecha de Inspección:</strong> {{ new Date(selectedInspection.fecha_hora).toLocaleString() }}</p>
        <div class="actions">
          <button class="btn-download" @click="downloadPDF">Descargar PDF</button>
          <button class="btn-close" @click="closePreview">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { supabase } from "@/supabase";
import jsPDF from "jspdf";

export default {
  name: "ListarInspeccionesPorRUC",
  setup() {
    const ruc = ref("");
    const inspecciones = ref([]);
    const error = ref(null);
    const selectedInspection = ref(null);

    const fetchInspections = async () => {
      error.value = null;
      inspecciones.value = [];
      try {
        const { data, error: fetchError } = await supabase.rpc(
          "obtener_inspecciones_por_ruc",
          { p_ruc: parseInt(ruc.value, 10) }
        );

        if (fetchError) {
          error.value = "Error al obtener inspecciones: " + fetchError.message;
        } else if (data.length === 0) {
          error.value = "No se encontraron inspecciones para este RUC.";
        } else {
          inspecciones.value = data;
        }
      } catch (err) {
        error.value = "Error inesperado al obtener inspecciones.";
        console.error(err);
      }
    };

    const showPreview = (inspeccion) => {
      selectedInspection.value = inspeccion;
    };

    const closePreview = () => {
      selectedInspection.value = null;
    };

    const downloadPDF = () => {
      const inspeccion = selectedInspection.value;
      const doc = new jsPDF();

      doc.setFont("Helvetica", "bold");
      doc.text("Certificado de Inspección", 105, 20, null, null, "center");

      doc.setFont("Helvetica", "normal");
      doc.text(`Razón Social: ${inspeccion.empresa_razon_social}`, 20, 40);
      doc.text(`Nombre Comercial: ${inspeccion.empresa_nombre_comercial}`, 20, 50);
      doc.text(`Dirección Central: ${inspeccion.direccion_central}`, 20, 60);
      doc.text(`Placa: ${inspeccion.placa}`, 20, 70);
      doc.text(`Tipo de Inspección: ${inspeccion.tipo_inspeccion}`, 20, 80);
      doc.text(`Estado: ${inspeccion.estado}`, 20, 90);

      doc.text(
        `Inspector: ${inspeccion.inspector_nombre} ${inspeccion.inspector_apellido}`,
        20,
        110
      );
      doc.text(
        `Certificador: ${inspeccion.certificador_nombre} ${inspeccion.certificador_apellido}`,
        20,
        120
      );

      doc.text(
        `Fecha de Inspección: ${new Date(inspeccion.fecha_hora).toLocaleString()}`,
        20,
        140
      );

      doc.save(`Certificado_Inspeccion_${inspeccion.id}.pdf`);
    };

    return {
      ruc,
      inspecciones,
      error,
      selectedInspection,
      fetchInspections,
      showPreview,
      closePreview,
      downloadPDF,
    };
  },
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.input {
  width: 300px;
  padding: 10px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.btn {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-preview {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
}

.preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.preview-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  width: 80%;
}

.actions {
  margin-top: 20px;
  text-align: center;
}

.btn-download {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  margin-right: 10px;
}

.btn-close {
  padding: 10px 20px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 5px;
}
</style>