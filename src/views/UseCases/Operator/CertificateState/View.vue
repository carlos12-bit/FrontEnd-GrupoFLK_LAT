<template>
  <div class="certificados-container">
    <h1>Listado de Certificados</h1>
    <table class="certificados-table">
      <thead>
        <tr>
          <th>#</th>
          <th>DNI</th>
          <th>Nombre del Curso</th>
          <th>Lugar de Servicio</th>
          <th>Fecha de Emisión</th>
          <th>Fecha de Vencimiento</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(certificado, index) in certificados" :key="certificado.Pk_certificado">
          <td>{{ index + 1 }}</td>
          <td>{{ certificado.dni }}</td>
          <td>{{ certificado.nombre_curso }}</td>
          <td>{{ certificado.lugar_servicio }}</td>
          <td>{{ formatDate(certificado.fecha_emision_certificado) }}</td>
          <td>{{ formatDate(certificado.fecha_vencimiento) }}</td>
          <td>
            <button class="btn btn-descargar" @click="descargarCertificado(certificado.documento_adjunto)">
              Descargar Certificado
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { supabase } from "@/supabase";

export default {
  name: "Certificados",
  setup() {
    const certificados = ref([]);

    const cargarCertificados = async () => {
      try {
        const { data, error } = await supabase
          .from("Certificado")
          .select("Pk_certificado, dni, nombre_curso, lugar_servicio, fecha_emision_certificado, fecha_vencimiento, documento_adjunto");

        if (error) throw error;

        certificados.value = data;
      } catch (error) {
        console.error("Error al cargar los certificados:", error.message);
      }
    };

    const descargarCertificado = (archivo) => {
      const { publicURL } = supabase.storage.from("certificados").getPublicUrl(archivo);
      window.open(publicURL, "_blank");
    };

    const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : "No especificado");

    onMounted(() => {
      cargarCertificados();
    });

    return {
      certificados,
      descargarCertificado,
      formatDate,
    };
  },
};
</script>

<style scoped>
.certificados-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
h1 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 28px;
}
.certificados-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}
.certificados-table th,
.certificados-table td {
  border: 1px solid #ddd;
  text-align: center;
  padding: 10px;
}
.certificados-table th {
  background-color: #f4f4f4;
}
.btn {
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}
.btn-descargar {
  background-color: #007bff;
  color: white;
  transition: background-color 0.3s;
}
.btn-descargar:hover {
  background-color: #0056b3;
}
</style>
