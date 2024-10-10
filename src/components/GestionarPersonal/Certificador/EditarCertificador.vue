<template>
    <div class="modal" tabindex="-1" role="dialog" style="display:block; background:rgba(0,0,0,0.5)">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Editar Certificador</h5>
            <button type="button" class="btn-close" @click="$emit('close')"></button>
          </div>
          <div class="modal-body">
            <input v-model="certificador.asistente_de_operaciones_id" placeholder="Asistente de Operaciones ID">
            <input v-model="certificador.tipo_inspeccion_id" placeholder="Tipo de Inspección ID">
            <input v-model="certificador.numero_certificado" placeholder="Número de Certificado">
            <input v-model="certificador.entidad_certificadora" placeholder="Entidad Certificadora">
            <input v-model="certificador.fecha_de_emision_de_certificado" placeholder="Fecha de Emisión" type="date">
            <input v-model="certificador.fecha_de_caducidad_de_certificado" placeholder="Fecha de Caducidad" type="date">
            <input v-model="certificador.Estado" type="checkbox"> Activo
            <button @click="updateCertificador">Guardar</button>
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
      async updateCertificador() {
        const { data, error } = await supabase
          .from('certificador')
          .update(this.certificador)
          .eq('id', this.id);
  
        if (!error) {
          console.log('Certificador actualizado:', data);
          this.$emit('close');
        } else {
          console.error('Error updating certificador:', error);
        }
      }
    }
  };
  </script>
  