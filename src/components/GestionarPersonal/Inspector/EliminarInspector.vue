<template>
    <div class="modal" tabindex="-1" role="dialog" style="display:block; background:rgba(0,0,0,0.5)">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Eliminar Inspector</h5>
            <button type="button" class="btn-close" @click="$emit('close')"></button>
          </div>
          <div class="modal-body">
            <p>¿Estás seguro de que deseas eliminar a este inspector?</p>
            <button @click="deleteInspector">Eliminar</button>
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
      async deleteInspector() {
        const { error } = await supabase
          .from('inspector')
          .delete()
          .eq('id', this.id);
  
        if (!error) {
          console.log('Inspector eliminado');
          this.$emit('close');
        } else {
          console.error('Error deleting inspector:', error);
        }
      }
    }
  };
  </script>
  