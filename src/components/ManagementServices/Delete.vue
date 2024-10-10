<template>
  <div class="card mb-4">
    <div class="card-header bg-danger text-white">
      <h5 class="card-title">Confirmación de Eliminación</h5>
    </div>
    <div class="card-body">
      <p>¿Estás seguro de que deseas eliminar este servicio?</p>
      <button class="btn btn-danger w-100" @click="confirmDelete">Eliminar</button>
    </div>
  </div>
</template>

<script>
import { supabase } from '@/supabase';

export default {
  props: {
    serviceId: Number,
  },
  methods: {
    async confirmDelete() {
      const { error } = await supabase
        .from('Tipo_de_Inspeccion')
        .delete()
        .eq('id', this.serviceId);

      if (error) {
        console.error(error);
      } else {
        this.$emit('serviceDeleted');
      }
    },
  },
};
</script>

<style scoped>
.card {
  margin-top: 20px;
}

.card-title {
  text-align: center;
}
</style>
