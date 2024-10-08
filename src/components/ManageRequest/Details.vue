<template>
    <navbar></navbar>
    <div class="container">
      <h1 class="page-title">Detalles de la Solicitud</h1>
      <div v-if="solicitud" class="detalle-solicitud">
        <p><strong>Nombre Completo:</strong> {{ solicitud.nombre_completo }}</p>
        <p><strong>DNI:</strong> {{ solicitud.dni }}</p>
        <p><strong>Fecha de Solicitud:</strong> {{ new Date(solicitud.fecha_solicitud).toLocaleDateString() }}</p>
        <p><strong>Curso Solicitado:</strong> {{ solicitud.curso_solicitado }}</p>
        <p><strong>Número Telefónico:</strong> {{ solicitud.nro_telefonico }}</p>
        <p><strong>Dirección:</strong> {{ solicitud.direccion }}</p>
        <p><strong>Correo Electrónico:</strong> {{ solicitud.correo_electronico }}</p>
        <p><strong>Nacionalidad:</strong> {{ solicitud.nacionalidad }}</p>
        
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
        <button @click="gestionarSolicitud('rechazar')" class="card-btn card-btn-rechazar">Rechazar</button>
      </div>
    </div>
  </template>
  
  <script>
  import { supabase } from '@/supabase.js';
  
  export default {
    name: "DetallesSolicitud",
    data() {
      return {
        solicitud: null
      };
    },
    async mounted() {
      // Obtenemos los detalles de la solicitud seleccionada usando el id pasado por params
      let { data: solicitud, error } = await supabase
        .from('Solicitud_Capacitacion')
        .select('*')
        .eq('id_solicitud', this.$route.params.id)
        .single();
  
      if (error) {
        console.error("Error fetching data: ", error);
      } else {
        this.solicitud = solicitud;
      }
    },
    methods: {
      async gestionarSolicitud(accion) {
        let nuevoEstado = accion === 'aceptar' ? 'Aceptada' : 'Rechazada';
  
        try {
          const { error } = await supabase
            .from('Solicitud_Capacitacion')
            .update({ estado: nuevoEstado })
            .eq('id_solicitud', this.$route.params.id);
  
          if (error) {
            throw error;
          }
  
          alert(`La solicitud ha sido ${nuevoEstado}`);
          this.$router.push({ name: 'GestionarSolicitudes' });
  
        } catch (error) {
          console.error(`Error al ${accion} la solicitud: `, error);
          alert(`Ocurrió un error al ${accion} la solicitud`);
        }
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
  </style>
  