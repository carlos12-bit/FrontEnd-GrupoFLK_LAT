<template>
    <el-form :model="form" label-width="120px">
    <el-form-item label="Descripción">
        <el-input v-model="form.descripcion" placeholder="Descripción"></el-input>
    </el-form-item>
    <el-form-item>
        <el-button type="primary" @click="handleUpdate">Actualizar</el-button>
    </el-form-item>
    </el-form>
</template>
<script>
import { supabase } from '@/supabase'
export default {
    props: {
    machinery: Object,
    },
    data() {
    return {
        form: { ...this.machinery },
    }
    },
    methods: {
    async handleUpdate() {
        const { data, error } = await supabase
        .from('tipo_de_maquinaria')
        .update({ ...this.form, fecha_de_modificacion: new Date().toISOString() })
        .eq('id', this.form.id)
        .select()
        if (error) {
        this.$message.error('Error al actualizar el tipo de maquinaria')
        } else {
        this.$message.success('Tipo de maquinaria actualizado con éxito')
        this.$emit('updated', data[0])
        }
    },
    },
}
</script>  