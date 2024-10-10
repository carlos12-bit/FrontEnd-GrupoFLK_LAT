<template>
    <div class="container">
      <h2>Crear Certificador</h2>
      <form @submit.prevent="crearCertificador">
        <div class="mb-3">
          <label for="asistente_de_operaciones_id" class="form-label">Asistente de Operaciones ID</label>
          <input type="text" class="form-control" v-model="certificador.asistente_de_operaciones_id" required />
        </div>
  
        <div class="mb-3">
          <label for="certificado_digital" class="form-label">Certificado Digital</label>
          <input type="text" class="form-control" v-model="certificador.certificado_digital" required />
        </div>
  
        <div class="mb-3">
          <label for="numero_certificado" class="form-label">Número de Certificado</label>
          <input type="text" class="form-control" v-model="certificador.numero_certificado" required />
        </div>
  
        <div class="mb-3">
          <label for="entidad_certificadora" class="form-label">Entidad Certificadora</label>
          <input type="text" class="form-control" v-model="certificador.entidad_certificadora" required />
        </div>
  
        <div class="mb-3">
          <label for="tipo_inspeccion_id" class="form-label">Tipo de Inspección ID</label>
          <input type="number" class="form-control" v-model="certificador.tipo_inspeccion_id" required />
        </div>
  
        <div class="mb-3">
          <label for="fecha_de_emision_de_certificado" class="form-label">Fecha de Emisión</label>
          <input type="date" class="form-control" v-model="certificador.fecha_de_emision_de_certificado" required />
        </div>
  
        <div class="mb-3">
          <label for="fecha_de_caducidad_de_certificado" class="form-label">Fecha de Caducidad</label>
          <input type="date" class="form-control" v-model="certificador.fecha_de_caducidad_de_certificado" />
        </div>
  
        <div class="mb-3">
          <label for="estado" class="form-label">Estado</label>
          <select class="form-select" v-model="certificador.estado">
            <option :value="true">Activo</option>
            <option :value="false">Inactivo</option>
          </select>
        </div>
  
        <button type="submit" class="btn btn-primary">Crear Certificador</button>
      </form>
  
      <div v-if="mensaje" class="alert alert-info mt-3">{{ mensaje }}</div>
    </div>
  </template>
  
  <script>
  import { supabase } from '@/supabase'; // Asegúrate de tener la configuración correcta de supabase
  
  export default {
    data() {
      return {
        certificador: {
          asistente_de_operaciones_id: '',
          certificado_digital: '',
          numero_certificado: '',
          entidad_certificadora: '',
          tipo_inspeccion_id: null,
          fecha_de_emision_de_certificado: '',
          fecha_de_caducidad_de_certificado: '',
          estado: true
        },
        mensaje: null
      };
    },
    methods: {
      async crearCertificador() {
        try {
          const { data, error } = await supabase
            .from('certificador')
            .insert([this.certificador])
            .select();
  
          if (error) {
            console.error('Error creando certificador:', error);
            this.mensaje = 'Error creando el certificador.';
          } else {
            this.mensaje = 'Certificador creado exitosamente.';
            this.limpiarFormulario();
          }
        } catch (error) {
          console.error('Error en la petición:', error);
          this.mensaje = 'Error creando el certificador.';
        }
      },
      limpiarFormulario() {
        this.certificador = {
          asistente_de_operaciones_id: '',
          certificado_digital: '',
          numero_certificado: '',
          entidad_certificadora: '',
          tipo_inspeccion_id: null,
          fecha_de_emision_de_certificado: '',
          fecha_de_caducidad_de_certificado: '',
          estado: true
        };
      }
    }
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 600px;
    margin: auto;
  }
  </style>
  