<template>
    <div class="modal" tabindex="-1" role="dialog" style="display:block; background:rgba(0,0,0,0.5)">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Consultar Inspector</h5>
            <button type="button" class="btn-close" @click="$emit('close')"></button>
          </div>
          <div class="modal-body">
            <p><strong>Asistente de Operaciones ID:</strong> {{ inspector.asistente_de_operaciones_id }}</p>
            <p><strong>Tipo de Inspección ID:</strong> {{ inspector.tipo_de_inspeccion_id }}</p>
            <p><strong>Número de Certificado:</strong> {{ inspector.numero_certificado }}</p>
            <p><strong>Entidad Certificadora:</strong> {{ inspector.entidad_certificadora }}</p>
            <p><strong>Fecha de Emisión:</strong> {{ new Date(inspector.fecha_de_emision_de_certificado).toLocaleDateString() }}</p>
            <p><strong>Fecha de Caducidad:</strong> {{ new Date(inspector.fecha_de_caducidad_de_certificado).toLocaleDateString() }}</p>
            <p><strong>Estado:</strong> {{ inspector.Estado ? 'Activo' : 'Inactivo' }}</p>
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
        inspector: {}
      };
    },
    async mounted() {
      await this.fetchInspector();
    },
    methods: {
      async fetchInspector() {
        let { data: inspector, error } = await supabase
          .from('inspector')
          .select('*')
          .eq('id', this.id);
  
        if (!error) {
          this.inspector = inspector[0];
        } else {
          console.error('Error fetching inspector:', error);
        }
      }
    }
  };
  </script>
  