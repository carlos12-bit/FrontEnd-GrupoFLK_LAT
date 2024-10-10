<template>
  <el-form :model="form" label-width="120px">
    <el-form-item label="Descripción">
      <el-input v-model="form.descripcion" placeholder="Descripción"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSubmit">Guardar</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { supabase } from '@/supabase'
import { getSession } from '@/auth'

export default {
  data() {
    return {
      form: {
        descripcion: '',
        autor: '', // Inicialmente vacío, lo llenamos con el UUID luego
      },
    }
  },
  async created() {
    try {
      const session = await getSession(); // Obtener la sesión actual
      this.form.autor = session.user.id; // Asigna el UUID del usuario autenticado a "autor"
    } catch (error) {
      this.$message.error('Error al obtener el UUID del usuario');
    }
  },
  methods: {
    async handleSubmit() {
      if (!this.form.autor) {
        this.$message.error('No se pudo obtener el UUID del usuario');
        return;
      }

      const { data, error } = await supabase
        .from('tipo_de_maquinaria')
        .insert([this.form])
        .select();

      if (error) {
        this.$message.error('Error al crear el tipo de maquinaria');
      } else {
        this.$message.success('Tipo de maquinaria creado con éxito');
        this.$emit('created', data[0]);
      }
    },
  },
}
</script>
