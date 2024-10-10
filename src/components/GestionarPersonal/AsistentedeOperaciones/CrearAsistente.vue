<template>
    <div class="container">
      <h2>Crear Asistente de Operaciones</h2>
      <form @submit.prevent="crearAsistente">
        <div class="mb-3">
          <label for="nombres" class="form-label">Nombres</label>
          <input type="text" class="form-control" v-model="asistente.nombres" required />
        </div>
  
        <div class="mb-3">
          <label for="apellido_paterno" class="form-label">Apellido Paterno</label>
          <input type="text" class="form-control" v-model="asistente.apellido_paterno" required />
        </div>
  
        <div class="mb-3">
          <label for="apellido_materno" class="form-label">Apellido Materno</label>
          <input type="text" class="form-control" v-model="asistente.apellido_materno" required />
        </div>
  
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input type="email" class="form-control" v-model="asistente.email" required />
        </div>
  
        <div class="mb-3">
          <label for="telefono" class="form-label">Teléfono</label>
          <input type="text" class="form-control" v-model="asistente.telefono" required />
        </div>
  
        <div class="mb-3">
          <label for="dni" class="form-label">DNI</label>
          <input type="text" class="form-control" v-model="asistente.dni" required />
        </div>
  
        <div class="mb-3">
          <label for="provincia_id" class="form-label">Provincia ID</label>
          <input type="number" class="form-control" v-model="asistente.provincia_id" required />
        </div>
  
        <div class="mb-3">
          <label for="firma" class="form-label">Firma</label>
          <input type="text" class="form-control" v-model="asistente.firma" />
        </div>
  
        <div class="mb-3">
          <label for="sello" class="form-label">Sello</label>
          <input type="text" class="form-control" v-model="asistente.sello" />
        </div>
  
        <button type="submit" class="btn btn-primary">Crear Asistente</button>
      </form>
  
      <div v-if="mensaje" class="alert alert-info mt-3">{{ mensaje }}</div>
    </div>
  </template>
  
  <script>
  import { supabase } from '@/supabase'; // Asegúrate de tener la configuración de supabase correctamente importada
  
  export default {
    data() {
      return {
        asistente: {
          nombres: '',
          apellido_paterno: '',
          apellido_materno: '',
          email: '',
          telefono: '',
          dni: '',
          provincia_id: null,
          firma: '',
          sello: ''
        },
        mensaje: null
      };
    },
    methods: {
      async crearAsistente() {
        try {
          const { data, error } = await supabase
            .from('asistente_de_operaciones_pe')
            .insert([this.asistente])
            .select();
  
          if (error) {
            console.error('Error creando asistente:', error);
            this.mensaje = 'Error creando el asistente.';
          } else {
            this.mensaje = 'Asistente creado exitosamente.';
            this.limpiarFormulario();
          }
        } catch (error) {
          console.error('Error en la petición:', error);
          this.mensaje = 'Error creando el asistente.';
        }
      },
      limpiarFormulario() {
        this.asistente = {
          nombres: '',
          apellido_paterno: '',
          apellido_materno: '',
          email: '',
          telefono: '',
          dni: '',
          provincia_id: null,
          firma: '',
          sello: ''
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