<template>
    <div class="modal" tabindex="-1" role="dialog" style="display:block; background:rgba(0,0,0,0.5)">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Consultar Asistente</h5>
            <button type="button" class="btn-close" @click="$emit('close')"></button>
          </div>
          <div class="modal-body">
            <p><strong>Nombres:</strong> {{ asistente.nombres }}</p>
            <p><strong>Apellido Paterno:</strong> {{ asistente.apellido_paterno }}</p>
            <p><strong>Apellido Materno:</strong> {{ asistente.apellido_materno }}</p>
            <p><strong>DNI:</strong> {{ asistente.dni }}</p>
            <p><strong>Teléfono:</strong> {{ asistente.telefono }}</p>
            <p><strong>Provincia:</strong> {{ asistente.provincia_id }}</p>
            <p><strong>Firma:</strong> {{ asistente.firma }}</p>
            <p><strong>Sello:</strong> {{ asistente.sello }}</p>
            <p><strong>Fecha de Creación:</strong> {{ new Date(asistente.fecha_de_creacion).toLocaleDateString() }}</p>
            <p><strong>Foto de Perfil:</strong> <img :src="asistente.Foto_Perfil" alt="Foto de Perfil" width="100"></p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { supabase } from '@/supabase.js';
  
  export default {
    props: ['id'],
    data() {
      return {
        asistente: {}
      };
    },
    async mounted() {
      await this.fetchAsistente();
    },
    methods: {
      async fetchAsistente() {
        let { data: asistente, error } = await supabase
          .from('asistente_de_operaciones')
          .select('*')
          .eq('id', this.id);
  
        if (!error) {
          this.asistente = asistente[0];
        } else {
          console.error('Error fetching asistente:', error);
        }
      }
    }
  };
  </script>
  