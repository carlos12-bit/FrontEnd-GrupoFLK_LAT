<template>
    <div class="modal" tabindex="-1" role="dialog" style="display:block; background:rgba(0,0,0,0.5)">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Eliminar Asistente</h5>
            <button type="button" class="btn-close" @click="$emit('close')"></button>
          </div>
          <div class="modal-body">
            <p>¿Estás seguro de que deseas eliminar a {{ asistente.nombres }}?</p>
            <button @click="deleteAsistente">Eliminar</button>
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
      async deleteAsistente() {
        const { error } = await supabase
          .from('asistente_de_operaciones')
          .delete()
          .eq('id', this.id);
  
        if (!error) {
          console.log('Asistente eliminado');
          this.$emit('close');
        } else {
          console.error('Error deleting asistente:', error);
        }
      }
    }
  };
  </script>
  