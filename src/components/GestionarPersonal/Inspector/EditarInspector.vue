<template>
    <div class="modal" tabindex="-1" role="dialog" style="display:block; background:rgba(0,0,0,0.5)">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Editar Inspector</h5>
            <button type="button" class="btn-close" @click="$emit('close')"></button>
          </div>
          <div class="modal-body">
            <input v-model="inspector.asistente_de_operaciones_id" placeholder="Asistente de Operaciones ID">
            <input v-model="inspector.tipo_de_inspeccion_id" placeholder="Tipo de Inspección ID">
            <input v-model="inspector.numero_certificado" placeholder="Número de Certificado">
            <input v-model="inspector.entidad_certificadora" placeholder="Entidad Certificadora">
            <input v-model="inspector.fecha_de_emision_de_certificado" placeholder="Fecha de Emisión" type="date">
            <input v-model="inspector.fecha_de_caducidad_de_certificado" placeholder="Fecha de Caducidad" type="date">
            <input v-model="inspector.Estado" type="checkbox"> Activo
            <button @click="updateInspector">Guardar</button>
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
      },
      async updateInspector() {
        const { data, error } = await supabase
          .from('inspector')
          .update(this.inspector)
          .eq('id', this.id);
  
        if (!error) {
          console.log('Inspector actualizado:', data);
          this.$emit('close');
        } else {
          console.error('Error updating inspector:', error);
        }
      }
    }
  };
  </script>
  