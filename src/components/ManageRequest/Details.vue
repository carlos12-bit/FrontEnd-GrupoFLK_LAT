<template>
  <div class="container">
    <h1 class="page-title">Detalles de la Solicitud</h1>
    <div v-if="solicitud" class="detalle-solicitud">
      <p><strong>Nombre Completo:</strong> {{ solicitud.nombre_completo }}</p>
      <p><strong>DNI:</strong> {{ solicitud.dni }}</p>
      <p><strong>Fecha de Nacimiento:</strong> {{ new Date(solicitud.fecha_nacimiento).toLocaleDateString() }}</p>
      <p><strong>Dirección:</strong> {{ solicitud.direccion }}</p>
      <p><strong>Número Telefónico:</strong> {{ solicitud.nro_telefonico }}</p>
      <p><strong>Teléfono de Contacto:</strong> {{ solicitud.telefono_contacto }}</p>
      <p><strong>Correo Electrónico:</strong> {{ solicitud.correo_electronico }}</p>
      <p><strong>Nacionalidad:</strong> {{ solicitud.nacionalidad }}</p>
      <p><strong>Ocupación Actual:</strong> {{ solicitud.ocupacion_actual }}</p>
      <p><strong>Nombre de Empresa:</strong> {{ solicitud.nombre_empresa }}</p>
      <p><strong>Cargo Actual:</strong> {{ solicitud.cargo_actual }}</p>
      <p><strong>Experiencia con Maquinaria:</strong> {{ solicitud.experiencia_maquinaria }}</p>
      <p><strong>Nombre del Contacto de Emergencia:</strong> {{ solicitud.nombre_contacto_emergencia }}</p>
      <p><strong>Relación con Contacto de Emergencia:</strong> {{ solicitud.relacion_contacto_emergencia }}</p>
      <p><strong>Teléfono de Contacto de Emergencia:</strong> {{ solicitud.telefono_contacto_emergencia }}</p>
      <p><strong>Curso Solicitado:</strong> {{ solicitud.Cursos.titulo_curso }}</p>
      <p><strong>Fecha de Inicio Preferida:</strong> {{ new Date(solicitud.fecha_inicio_preferida).toLocaleDateString() }}</p>
      <p><strong>Turno Preferido:</strong> {{ solicitud.turno_preferido }}</p>
      <p><strong>Alergias o Condiciones:</strong> {{ solicitud.alergias_condiciones }}</p>
      <p><strong>Necesidades Especiales:</strong> {{ solicitud.necesidades_especiales }}</p>
      <p><strong>Consentimiento de Participación:</strong> {{ solicitud.consentimiento_participacion ? 'Sí' : 'No' }}</p>
      <p><strong>Autorización de Imagen:</strong> {{ solicitud.autorizacion_imagen ? 'Sí' : 'No' }}</p>
      <p><strong>Fecha de Solicitud:</strong> {{ new Date(solicitud.fecha_solicitud).toLocaleDateString() }}</p>
      <p><strong>Consentimiento para Tratamiento de Datos:</strong> {{ solicitud.consentimiento_tratamiento_datos ? 'Sí' : 'No' }}</p>
      <p><strong>Firma:</strong> {{ solicitud.firma }}</p>

      <div v-if="solicitud.dni_adjunto">
        <p><strong>DNI Adjunto:</strong></p>
        <img :src="solicitud.dni_adjunto" alt="DNI Adjunto" class="imagen-adjunta" />
      </div>

      <div v-if="solicitud.certificado_medico_adjunto">
        <p><strong>Certificado Médico Adjunto:</strong></p>
        <img :src="solicitud.certificado_medico_adjunto" alt="Certificado Médico Adjunto" class="imagen-adjunta" />
      </div>

      <div v-if="solicitud.licencia_conducir_adjunto">
        <p><strong>Licencia de Conducir Adjunto:</strong></p>
        <img :src="solicitud.licencia_conducir_adjunto" alt="Licencia de Conducir Adjunto" class="imagen-adjunta" />
      </div>

      <!-- Botones de Aceptar y Rechazar -->
      <button @click="gestionarSolicitud('aceptado')" class="card-btn">Aceptar</button>
      <button @click="abrirModalRechazo" class="card-btn card-btn-rechazar">Rechazar</button>
    </div>

    <div v-if="mostrarModalRechazo" class="modal">
      <div class="modal-content">
        <h3>Motivo de Rechazo</h3>
        <textarea v-model="motivoRechazo" placeholder="Ingrese el motivo del rechazo"></textarea>
        <div class="modal-buttons">
          <button @click="gestionarSolicitud('rechazado')" class="card-btn">Confirmar Rechazo</button>
          <button @click="cerrarModalRechazo" class="card-btn card-btn-rechazar">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from '@/supabase.js';

export default {
  name: "DetallesSolicitud",
  data() {
    return {
      solicitud: null,
      mostrarModalRechazo: false,
      motivoRechazo: "" // Motivo para el rechazo
    };
  },
  async mounted() {
    const solicitudId = this.$route.query.id;
    console.log("ID de solicitud:", solicitudId); // Verifica que el ID se está recibiendo correctamente
    if (!solicitudId) {
      console.error("ID de solicitud no encontrado en la URL.");
      return;
    }

    let { data: solicitud, error } = await supabase
      .from('Solicitud_Capacitacion')
      .select(`*, Cursos (titulo_curso)`)
      .eq('id_solicitud', solicitudId)
      .single();

    if (error) {
      console.error("Error fetching data: ", error);
    } else {
      this.solicitud = solicitud;
    }
  },
  methods: {
    abrirModalRechazo() {
      this.mostrarModalRechazo = true;
    },
    cerrarModalRechazo() {
      this.mostrarModalRechazo = false;
    },
    async gestionarSolicitud(estado) {
      let nuevoEstado = estado === 'aceptado' ? 'Aceptada' : 'Rechazada';

      try {
        const { error } = await supabase
          .from('Solicitud_Capacitacion')
          .update({ 
            estado: nuevoEstado, 
            motivo_rechazo: estado === 'rechazado' ? this.motivoRechazo : null 
          })
          .eq('id_solicitud', this.$route.query.id);

        if (error) {
          throw error;
        }

        alert(`La solicitud ha sido ${nuevoEstado}`);
        this.$router.push({ path: '/admin-dashboard/ManageRequest' });

      } catch (error) {
        console.error(`Error al ${estado} la solicitud: `, error);
        alert(`Ocurrió un error al ${estado} la solicitud`);
      } finally {
        this.cerrarModalRechazo();
      }
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.page-title {
  font-size: 2rem;
  color: #34495e;
  text-align: center;
  margin-bottom: 1.5rem;
  font-weight: bold;
}

.detalle-solicitud {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  font-size: 1rem;
  color: #2c3e50;
}

.detalle-solicitud p {
  margin: 0;
  background-color: #f7f9fc;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.detalle-solicitud p strong {
  color: #2980b9;
}

.imagen-adjunta {
  max-width: 100%;
  margin-top: 1rem;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.card-btn, .card-btn-rechazar {
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.3s ease;
}

.card-btn {
  background-color: #1A5276;
  color: white;
}

.card-btn:hover {
  background-color: #2980b9;
}

.card-btn-rechazar {
  background-color: #C0392B;
  color: white;
}

.card-btn-rechazar:hover {
  background-color: #E74C3C;
}

/* Modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.modal-content h3 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
  color: #34495e;
}

.modal-content textarea {
  width: 100%;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.modal-buttons {
  display: flex;
  justify-content: space-around;
}
</style>
