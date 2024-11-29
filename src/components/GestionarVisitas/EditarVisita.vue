<template>
  <div>
    <el-form :model="inspeccion" ref="form" label-width="120px">
      <el-form-item label="Empresa">
        <el-input v-model="inspeccion.nombre_empresa" placeholder="Nombre de la empresa" />
      </el-form-item>
      <el-form-item label="Ubicación">
        <el-input v-model="inspeccion.ubicacion" placeholder="Ubicación de la inspección" />
      </el-form-item>
      <el-form-item label="Fecha de Inicio">
        <el-date-picker
          v-model="inspeccion.fecha_inicio"
          type="datetime"
          placeholder="Fecha de inicio"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="Estado">
        <el-select v-model="inspeccion.estado_inspeccion" placeholder="Estado de la inspección">
          <el-option label="Pendiente" value="Pendiente" />
          <el-option label="En proceso" value="En proceso" />
          <el-option label="Finalizada" value="Finalizada" />
          <el-option label="Cancelada" value="Cancelada" />
        </el-select>
      </el-form-item>
      <el-form-item label="Tipo de Producto">
        <el-input v-model="inspeccion.nombre_tipo_producto" placeholder="Tipo de producto" />
      </el-form-item>
    </el-form>
    
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeModal">Cancelar</el-button>
      <el-button type="primary" @click="saveChanges">Guardar Cambios</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    inspeccion: {
      type: Object,
      required: true
    }
  },
  methods: {
    closeModal() {
      this.$emit('closeModal');
    },
    async saveChanges() {
      try {
        // Aquí puedes realizar la lógica para guardar los cambios, por ejemplo, actualizando en la base de datos.
        const { data, error } = await this.$supabase
          .from('inspecciones')
          .upsert(this.inspeccion);
        
        if (error) {
          console.error('Error al guardar cambios:', error.message);
        } else {
          this.$emit('refreshTable');
          this.$emit('closeModal');
        }
      } catch (err) {
        console.error('Error al conectar con Supabase:', err.message);
      }
    }
  }
};
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
