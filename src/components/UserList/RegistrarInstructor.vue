<template>
    <div class="register-instructor-container">
      <h1>Registrar Instructor</h1>
      <el-form :model="form" ref="form" label-width="120px" :rules="rules">
        <!-- Nombre -->
        <el-form-item label="Nombre" prop="nombre">
          <el-input v-model="form.nombre" placeholder="Ingrese el nombre"></el-input>
        </el-form-item>
  
        <!-- DNI -->
        <el-form-item label="DNI" prop="dni">
          <el-input v-model="form.dni" placeholder="Ingrese el DNI"></el-input>
        </el-form-item>
  
        <!-- Correo Electrónico -->
        <el-form-item label="Correo Electrónico" prop="correo">
          <el-input v-model="form.correo" placeholder="Ingrese el correo electrónico"></el-input>
        </el-form-item>
  
        <!-- Número Telefónico -->
        <el-form-item label="Número Telefónico" prop="nro_Telefonico">
          <el-input v-model="form.nro_Telefonico" placeholder="Ingrese el número telefónico"></el-input>
        </el-form-item>
  
        <!-- Modo de Curso -->
        <el-form-item label="Modo de Curso" prop="fk_modo_curso">
          <el-select v-model="form.fk_modo_curso" placeholder="Seleccione el modo de curso">
            <el-option
              v-for="modo in modosCurso"
              :key="modo.Pk_modocurso"
              :label="modo.nombre_modo"
              :value="modo.Pk_modocurso"
            ></el-option>
          </el-select>
        </el-form-item>
  
        <!-- Botones de Acción -->
        <el-form-item>
          <el-button type="primary" @click="submitForm">Registrar</el-button>
          <el-button @click="resetForm">Cancelar</el-button>
        </el-form-item>
      </el-form>
  
      <!-- Mensaje de Confirmación -->
      <el-dialog title="Éxito" :visible.sync="dialogVisible" width="30%">
        <span>El instructor ha sido registrado con éxito.</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">OK</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
import { ref } from 'vue';
import { supabase } from '@/supabase.js';
import { GetUser } from '@/auth'; // Asegúrate de que esta función esté correctamente exportada

export default {
  name: 'RegistrarInstructor',
  data() {
    return {
      form: {
        nombre: '',
        dni: '',
        correo: '',
        nro_Telefonico: '',
        fk_modo_curso: null
      },
      modosCurso: [],
      dialogVisible: false,
      rules: {
        nombre: [{ required: true, message: 'Por favor ingrese el nombre', trigger: 'blur' }],
        dni: [{ required: true, message: 'Por favor ingrese el DNI', trigger: 'blur' }],
        correo: [{ required: true, message: 'Por favor ingrese el correo electrónico', trigger: 'blur' }],
        nro_Telefonico: [{ required: true, message: 'Por favor ingrese el número telefónico', trigger: 'blur' }],
        fk_modo_curso: [{ required: true, message: 'Por favor seleccione el modo de curso', trigger: 'change' }]
      }
    };
  },
  async mounted() {
    try {
      // Obtener la lista de modos de curso desde la tabla 'modo_curso'
      const { data: modosCurso, error } = await supabase
        .from('Modo_Curso')
        .select('Pk_modocurso, nombre_modo');
      if (error) throw error;
      this.modosCurso = modosCurso;
    } catch (error) {
      console.error('Error al obtener los modos de curso:', error);
    }
  },
  methods: {
    async submitForm() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          try {
            const autor = GetUser(); // Obtener el UUID del usuario logeado
            const ultimoAutor = GetUser(); // Puedes poner otro valor si prefieres tener diferente "autor" y "último autor"

            // Insertar el instructor en la base de datos
            const { error } = await supabase.from('Instructor').insert({
              nombre: this.form.nombre,
              dni: this.form.dni,
              correo: this.form.correo,
              nro_Telefonico: this.form.nro_Telefonico,
              fk_modo_curso: this.form.fk_modo_curso,
              autor: autor,  // UUID del autor
              ultimo_autor: ultimoAutor // UUID del último autor
            });

            if (error) throw error;
            this.dialogVisible = true;  // Mostrar mensaje de éxito
            this.resetForm();           // Reiniciar formulario
          } catch (error) {
            console.error('Error al registrar instructor:', error);
          }
        } else {
          console.error("Formulario incompleto.");
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.form.resetFields();
    }
  }
};
</script>

<style scoped>
.register-instructor-container {
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
