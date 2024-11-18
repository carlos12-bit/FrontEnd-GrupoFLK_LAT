<template>
  <div class="reasignar-capacitacion-container">
    <h1>Reasignar Capacitación</h1>
    <el-form :model="form" ref="form" label-width="120px" :rules="rules">
      <!-- Selección de Curso -->
      <el-form-item label="Curso" prop="Fk_curso">
        <el-select v-model="form.Fk_curso" placeholder="Seleccione un curso">
          <el-option
            v-for="curso in cursos"
            :key="curso.pk_curso"
            :label="curso.titulo_curso"
            :value="curso.pk_curso"
          ></el-option>
        </el-select>
      </el-form-item>

      <!-- Selección de Operador -->
      <el-form-item label="Operador" prop="fk_operador">
        <el-select v-model="form.fk_operador" placeholder="Seleccione un operador">
          <el-option
            v-for="operador in operadores"
            :key="operador.Pk_Alumno"
            :label="operador.nombre + ' ' + operador.apellidos"
            :value="operador.Pk_Alumno"
          ></el-option>
        </el-select>
      </el-form-item>

      <!-- Título de la Capacitación -->
      <el-form-item label="Título" prop="titulo">
        <el-input
          v-model="form.titulo"
          placeholder="Ingrese el título de la capacitación"
        ></el-input>
      </el-form-item>

      <!-- Fecha de Inicio -->
      <el-form-item label="Fecha de Inicio" prop="fecha_inicio">
        <el-date-picker
          v-model="form.fecha_inicio"
          type="date"
          placeholder="Seleccione la fecha de inicio"
        ></el-date-picker>
      </el-form-item>

      <!-- Fecha de Fin -->
      <el-form-item label="Fecha de Fin" prop="fecha_fin">
        <el-date-picker
          v-model="form.fecha_fin"
          type="date"
          placeholder="Seleccione la fecha de fin"
        ></el-date-picker>
      </el-form-item>

      <!-- Estado -->
      <el-form-item label="Estado" prop="estado">
        <el-switch
          v-model="form.estado"
          active-text="Activo"
          inactive-text="Inactivo"
        ></el-switch>
      </el-form-item>

      <!-- Botones de Acción -->
      <el-form-item>
        <el-button type="primary" @click="submitForm">Reasignar</el-button>
        <el-button @click="resetForm">Cancelar</el-button>
      </el-form-item>
    </el-form>

    <!-- Mensaje de Confirmación -->
    <el-dialog
      title="Éxito"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <span>La capacitación ha sido agendada con éxito.</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">OK</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { ref } from "vue";
import { supabase } from "@/supabase.js";

export default {
  name:"ReasignarCapacitacion",
  data() {
    return {
      form: {
        Fk_curso: "",
        fk_operador: "",
        titulo: "",
        fecha_inicio: "",
        fecha_fin: "",
        estado: true, // Asumiendo que el estado predeterminado es activo
      },
      cursos: [],
      operadores: [],
      dialogVisible: false,
      rules: {
        Fk_curso: [{ required: true, message: "Por favor seleccione un curso", trigger: "change" }],
        fk_operador: [{ required: true, message: "Por favor seleccione un operador", trigger: "change" }],
        titulo: [{ required: true, message: "Por favor ingrese un título", trigger: "blur" }],
        fecha_inicio: [{ required: true, message: "Por favor seleccione una fecha de inicio", trigger: "change" }],
        fecha_fin: [{ required: true, message: "Por favor seleccione una fecha de fin", trigger: "change" }],
        estado: [{ required: true, message: "Por favor seleccione un estado", trigger: "change" }],
      },
    };
  },
  async mounted() {
    try {
      // Obtener la lista de cursos desde la tabla 'cursos'
      const { data: cursos, error: cursosError } = await supabase
        .from("cursos")
        .select("pk_curso, titulo_curso");
      if (cursosError) throw cursosError;
      this.cursos = cursos;

      // Obtener la lista de operadores desde la tabla 'Operador'
      const { data: operadores, error: operadoresError } = await supabase
        .from("Operador")
        .select("Pk_Alumno, nombre, apellidos");
      if (operadoresError) throw operadoresError;
      this.operadores = operadores;
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    }
  },
  methods: {
    async submitForm() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          try {
            // Insertar la capacitación en la tabla 'capacitacion_cursos'
            const { error } = await supabase.from("capacitacion_cursos").insert({
              fk_operador: this.form.fk_operador,
              titulo: this.form.titulo,
              fk_curso: this.form.Fk_curso,
              fecha_inicio: this.form.fecha_inicio,
              fecha_fin: this.form.fecha_fin,
              estado: this.form.estado,
            });
            if (error) throw error;

            this.dialogVisible = true; // Mostrar mensaje de éxito
            this.resetForm(); // Reiniciar formulario
          } catch (error) {
            console.error("Error al Reasignar capacitación:", error);
          }
        } else {
          console.error("Formulario incompleto.");
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.form.resetFields();
    },
  },
};
</script>

<style scoped>
.reasignar-capacitacion-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f4f4f9;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: #1a5276;
  margin-bottom: 1rem;
}

.el-form-item {
  margin-bottom: 1rem;
}

.el-button {
  margin-right: 0.5rem;
}
</style>
