<template>
    <div class="modal" tabindex="-1" role="dialog" style="display:block; background:rgba(0,0,0,0.5)">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Consultar Certificador</h5>
            <button type="button" class="btn-close" @click="$emit('close')"></button>
          </div>
          <div class="modal-body">
            <p><strong>Asistente de Operaciones ID:</strong> {{ certificador.asistente_de_operaciones_id }}</p>
            <p><strong>Tipo de Inspección ID:</strong> {{ certificador.tipo_inspeccion_id }}</p>
            <p><strong>Número de Certificado:</strong> {{ certificador.numero_certificado }}</p>
            <p><strong>Entidad Certificadora:</strong> {{ certificador.entidad_certificadora }}</p>
            <p><strong>Fecha de Emisión:</strong> {{ new Date(certificador.fecha_de_emision_de_certificado).toLocaleDateString() }}</p>
            <p><strong>Fecha de Caducidad:</strong> {{ new Date(certificador.fecha_de_caducidad_de_certificado).toLocaleDateString() }}</p>
            <p><strong>Estado:</strong> {{ certificador.Estado ? 'Activo' : 'Inactivo' }}</p>
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
      }
    }
  };
  </script>
  