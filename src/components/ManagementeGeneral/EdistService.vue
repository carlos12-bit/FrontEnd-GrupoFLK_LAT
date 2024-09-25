<template>
  <div>
    <h1>Editar Servicio</h1>
    <form @submit.prevent="editService">
      <div>
        <label for="nombre">Nombre</label>
        <input type="text" id="nombre" v-model="nombre" />
      </div>
      <div>
        <label for="descripcion">Descripción</label>
        <input type="text" id="descripcion" v-model="descripcion" />
      </div>
      <button type="submit">Editar</button>
    </form>
  </div>
</template>

<script>
import { supabase } from '../../supabase';

export default {
  name: 'EditService',
  data() {
    return {
      nombre: '',
      descripcion: ''
    };
  },
  methods: {
    async editService() {
      const { data, error } = await supabase
        .from('tipo_de_inspeccion')
        .update({
          nombre: this.nombre,
          descripcion: this.descripcion,
          tipo_de_maquinaria_id: 'otherValue' // Ajustar según sea necesario
        })
        .select();

      if (error) {
        console.error('Error al actualizar el servicio:', error);
      } else {
        console.log('Servicio actualizado:', data);
      }
    }
  }
};
</script>