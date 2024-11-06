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
      
      <!-- Mostrar imágenes adjuntas si existen -->
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
      <button @click="gestionarSolicitud('aceptar')" class="card-btn">Aceptar</button>
      <button @click="abrirModalRechazo" class="card-btn card-btn-rechazar">Rechazar</button>
    </div>

    <!-- Modal para Motivo de Rechazo -->
    <div v-if="mostrarModalRechazo" class="modal">
      <div class="modal-content">
        <h3>Motivo de Rechazo</h3>
        <textarea v-model="motivoRechazo" placeholder="Ingrese el motivo del rechazo"></textarea>
        <div class="modal-buttons">
          <button @click="gestionarSolicitud('rechazar')" class="card-btn">Confirmar Rechazo</button>
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
      motivoRechazo: "" // Para almacenar el motivo del rechazo
    };
  },
  async mounted() {
    // Obtenemos los detalles de la solicitud seleccionada usando el id pasado por params
    let { data: solicitud, error } = await supabase
      .from('Solicitud_Capacitacion')
      .select(`
        *,
        Cursos (titulo_curso)
      `)
      .eq('id_solicitud', this.$route.params.id)
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
    async gestionarSolicitud(accion) {
      let nuevoEstado = accion === 'aceptar' ? 'Aceptada' : 'Rechazada';
      
      if (accion === 'rechazar' && !this.motivoRechazo) {
        alert("Por favor, ingrese el motivo del rechazo.");
        return;
      }

      try {
        const { error } = await supabase
          .from('Solicitud_Capacitacion')
          .update({ 
            estado: nuevoEstado,
            motivo_rechazo: this.motivoRechazo // Guardar el motivo de rechazo en la base de datos
          })
          .eq('id_solicitud', this.$route.params.id);

        if (error) {
          throw error;
        }

        alert(`La solicitud ha sido ${nuevoEstado}`);
        
        // Redirigir al componente ManageRequest después de la acción
        this.$router.push({ path: '/admin-dashboard/ManageRequest' });

      } catch (error) {
        console.error(`Error al ${accion} la solicitud: `, error);
        alert(`Ocurrió un error al ${accion} la solicitud`);
      } finally {
        this.cerrarModalRechazo();
      }
    },
    async logout() {
      await supabase.auth.signOut();
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f4f4f9;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.detalle-solicitud {
  font-size: 1.2rem;
  line-height: 2;
  color: black;
}

.page-title {
  color: black;
  text-align: center;
}

.imagen-adjunta {
  max-width: 300px;
  margin-bottom: 20px;
}

.card-btn {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #1A5276;
  color: white;
  border-radius: 5px;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.card-btn:hover {
  background-color: #2980B9;
}

.card-btn-rechazar {
  background-color: #C0392B;
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
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  max-width: 500px;
  width: 100%;
  text-align: center;
}

.modal-content textarea {
  width: 100%;
  height: 100px;
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #ddd;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
}
</style>