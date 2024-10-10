<template>
  <el-form :model="form" label-width="120px">
    <el-form-item label="Descripción">
      <el-input v-model="descripcion" placeholder="Descripción"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSubmit">Guardar</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { supabase } from '@/supabase'

export default {
  data() {
    return {
      descripcion: '', // Descripción del tipo de maquinaria
    }
  },
  methods: {
    async handleSubmit() {
      // Verificar si la descripción está vacía
      if (!this.descripcion) {
        this.$message.error('La descripción no puede estar vacía');
        return;
      }

      try {
        // Inserción de datos
        const { data, error } = await supabase
          .from('tipo_de_maquinaria')
          .insert([{ descripcion: this.descripcion }]) // Solo enviamos la descripción
          .select();

        if (error) {
          throw new Error('Error al crear el tipo de maquinaria: ' + error.message);
        }

        // Mensaje de éxito
        this.$message.success('Tipo de maquinaria creado con éxito');
        this.$emit('created', data[0]);

      } catch (error) {
        // Manejar error
        this.$message.error(`Error: ${error.message}`);
      }
    },
  },
}
</script>
