<template>
    <div class="modal" tabindex="-1" role="dialog" style="display:block; background:rgba(0,0,0,0.5)">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Eliminar Certificador</h5>
            <button type="button" class="btn-close" @click="$emit('close')"></button>
          </div>
          <div class="modal-body">
            <p>¿Estás seguro de que deseas eliminar a este certificador?</p>
            <button @click="deleteCertificador">Eliminar</button>
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
        certificador: {}
      };
    },
    async mounted() {
      await this.fetchCertificador();
    },
    methods: {
      async fetchCertificador() {
        let { data: certificador, error } = await supabase
          .from('certificador')
          .select('*')
          .eq('id', this.id);
  
        if (!error) {
          this.certificador = certificador[0];
        } else {
          console.error('Error fetching certificador:', error);
        }
      },
      async deleteCertificador() {
        const { error } = await supabase
          .from('certificador')
          .delete()
          .eq('id', this.id);
  
        if (!error) {
          console.log('Certificador eliminado');
          this.$emit('close');
        } else {
          console.error('Error deleting certificador:', error);
        }
      }
    }
  };
  </script>
  