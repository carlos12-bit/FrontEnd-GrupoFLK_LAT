<template>
    <div class="modal" tabindex="-1" role="dialog" style="display:block; background:rgba(0,0,0,0.5)">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Editar Asistente</h5>
            <button type="button" class="btn-close" @click="$emit('close')"></button>
          </div>
          <div class="modal-body">
            <input v-model="asistente.nombres" placeholder="Nombres">
            <input v-model="asistente.apellido_paterno" placeholder="Apellido Paterno">
            <input v-model="asistente.apellido_materno" placeholder="Apellido Materno">
            <input v-model="asistente.dni" placeholder="DNI">
            <input v-model="asistente.telefono" placeholder="Teléfono">
            <input v-model="asistente.provincia_id" placeholder="Provincia ID">
            <input v-model="asistente.firma" placeholder="Firma">
            <input v-model="asistente.sello" placeholder="Sello">
            <button @click="updateAsistente">Guardar</button>
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
      },
      async updateAsistente() {
        const { data, error } = await supabase
          .from('asistente_de_operaciones')
          .update(this.asistente)
          .eq('id', this.id);
  
        if (!error) {
          console.log('Asistente actualizado:', data);
          this.$emit('close');
        } else {
          console.error('Error updating asistente:', error);
        }
      }
    }
  };
  </script>
  