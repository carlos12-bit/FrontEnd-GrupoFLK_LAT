<template>
    <div class="container">
      <h2>Crear Inspector</h2>
      <form @submit.prevent="crearInspector">
        <div class="mb-3">
          <label for="asistente_de_operaciones_id" class="form-label">Asistente de Operaciones ID</label>
          <input type="text" class="form-control" v-model="inspector.asistente_de_operaciones_id" required />
        </div>
  
        <div class="mb-3">
          <label for="tipo_de_inspeccion_id" class="form-label">Tipo de Inspección ID</label>
          <input type="number" class="form-control" v-model="inspector.tipo_de_inspeccion_id" required />
        </div>
  
        <div class="mb-3">
          <label for="certificado_digital" class="form-label">Certificado Digital</label>
          <input type="text" class="form-control" v-model="inspector.certificado_digital" />
        </div>
  
        <div class="mb-3">
          <label for="numero_certificado" class="form-label">Número de Certificado</label>
          <input type="text" class="form-control" v-model="inspector.numero_certificado" required />
        </div>
  
        <div class="mb-3">
          <label for="entidad_certificadora" class="form-label">Entidad Certificadora</label>
          <input type="text" class="form-control" v-model="inspector.entidad_certificadora" />
        </div>
  
        <div class="mb-3">
          <label for="fecha_de_emision_de_certificado" class="form-label">Fecha de Emisión</label>
          <input type="date" class="form-control" v-model="inspector.fecha_de_emision_de_certificado" />
        </div>
  
        <div class="mb-3">
          <label for="fecha_de_caducidad_de_certificado" class="form-label">Fecha de Caducidad</label>
          <input type="date" class="form-control" v-model="inspector.fecha_de_caducidad_de_certificado" />
        </div>
  
        <div class="mb-3">
          <label for="estado" class="form-label">Estado</label>
          <select class="form-select" v-model="inspector.estado">
            <option :value="true">Activo</option>
            <option :value="false">Inactivo</option>
          </select>
        </div>
  
        <button type="submit" class="btn btn-primary">Crear Inspector</button>
      </form>
  
      <div v-if="mensaje" class="alert alert-info mt-3">{{ mensaje }}</div>
    </div>
  </template>
  
  <script>
  import { supabase } from '@/supabase'; // Asegúrate de tener la configuración de supabase correctamente importada
  
  export default {
    data() {
      return {
        inspector: {
          asistente_de_operaciones_id: '',
          tipo_de_inspeccion_id: null,
          certificado_digital: '',
          numero_certificado: '',
          entidad_certificadora: '',
          fecha_de_emision_de_certificado: '',
          fecha_de_caducidad_de_certificado: '',
          estado: true
        },
        mensaje: null
      };
    },
    methods: {
      async crearInspector() {
        try {
          const { data, error } = await supabase
            .from('inspector')
            .insert([this.inspector])
            .select();
  
          if (error) {
            console.error('Error creando inspector:', error);
            this.mensaje = 'Error creando el inspector.';
          } else {
            this.mensaje = 'Inspector creado exitosamente.';
            this.limpiarFormulario();
          }
        } catch (error) {
          console.error('Error en la petición:', error);
          this.mensaje = 'Error creando el inspector.';
        }
      },
      limpiarFormulario() {
        this.inspector = {
          asistente_de_operaciones_id: '',
          tipo_de_inspeccion_id: null,
          certificado_digital: '',
          numero_certificado: '',
          entidad_certificadora: '',
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
  