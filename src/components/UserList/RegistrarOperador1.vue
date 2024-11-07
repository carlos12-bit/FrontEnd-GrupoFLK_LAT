<template>
  <div class="register-operador-container">
    <h1>Registrar Operador</h1>
    <el-form :model="form" ref="form" label-width="120px" :rules="rules">
      <!-- Nombre -->
      <el-form-item label="Nombre" prop="nombre">
        <el-input v-model="form.nombre" placeholder="Ingrese el nombre"></el-input>
      </el-form-item>

      <!-- Apellidos -->
      <el-form-item label="Apellidos" prop="apellidos">
        <el-input v-model="form.apellidos" placeholder="Ingrese los apellidos"></el-input>
      </el-form-item>

      <!-- Fecha de Nacimiento -->
      <el-form-item label="Fecha de Nacimiento" prop="fecha_nacimiento">
        <el-date-picker
          v-model="form.fecha_nacimiento"
          type="date"
          placeholder="Seleccione la fecha de nacimiento"
        ></el-date-picker>
      </el-form-item>

      <!-- Número de Documento -->
      <el-form-item label="Número de Documento" prop="nro_documento">
        <el-input v-model="form.nro_documento" placeholder="Ingrese el número de documento"></el-input>
      </el-form-item>

      <!-- Número Telefónico -->
      <el-form-item label="Número Telefónico" prop="nro_telefonico">
        <el-input v-model="form.nro_telefonico" placeholder="Ingrese el número telefónico"></el-input>
      </el-form-item>

      <!-- Tipo de Documento -->
      <el-form-item label="Tipo de Documento" prop="Fk_tipodocumento">
        <el-select v-model="form.Fk_tipodocumento" placeholder="Seleccione el tipo de documento">
          <el-option
            v-for="tipo in tiposDocumento"
            :key="tipo.Pk_tipodocumento"
            :label="tipo.nombre"
            :value="tipo.Pk_tipodocumento"
          ></el-option>
        </el-select>
      </el-form-item>

      <!-- Correo Electrónico -->
      <el-form-item label="Correo Electrónico" prop="correo_electronico">
        <el-input v-model="form.correo_electronico" placeholder="Ingrese el correo electrónico"></el-input>
      </el-form-item>

      <!-- Botones de Acción -->
      <el-form-item>
        <el-button type="primary" @click="submitForm">Registrar</el-button>
        <el-button @click="resetForm">Cancelar</el-button>
      </el-form-item>
    </el-form>

    <!-- Mensaje de Confirmación -->
    <el-dialog title="Éxito" :visible.sync="dialogVisible" width="30%">
      <span>El operador ha sido registrado con éxito.</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">OK</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { ref } from 'vue';
import { supabase } from '@/supabase.js';
import { GetUser } from '@/auth'; // Asegúrate de que la función GetUser esté correctamente exportada

export default {
  name: 'RegistrarOperador',
  data() {
    return {
      form: {
        nombre: '',
        apellidos: '',
        fecha_nacimiento: '',
        nro_documento: '',
        nro_telefonico: '',
        Fk_tipodocumento: null,
        correo_electronico: ''
      },
      tiposDocumento: [],
      dialogVisible: false,
      rules: {
        nombre: [{ required: true, message: 'Por favor ingrese el nombre', trigger: 'blur' }],
        apellidos: [{ required: true, message: 'Por favor ingrese los apellidos', trigger: 'blur' }],
        fecha_nacimiento: [{ required: true, message: 'Por favor seleccione la fecha de nacimiento', trigger: 'change' }],
        nro_documento: [{ required: true, message: 'Por favor ingrese el número de documento', trigger: 'blur' }],
        nro_telefonico: [{ required: true, message: 'Por favor ingrese el número telefónico', trigger: 'blur' }],
        Fk_tipodocumento: [{ required: true, message: 'Por favor seleccione el tipo de documento', trigger: 'change' }],
        correo_electronico: [{ required: true, message: 'Por favor ingrese el correo electrónico', trigger: 'blur' }]
      }
    };
  },
  async mounted() {
    try {
      // Obtener la lista de tipos de documentos desde la tabla 'tipodocumento'
      const { data: tiposDocumento, error } = await supabase
        .from('tipo_documento')
        .select('Pk_tipodocumento, nombre');
      if (error) throw error;
      this.tiposDocumento = tiposDocumento;
    } catch (error) {
      console.error('Error al obtener los tipos de documento:', error);
    }
  },
  methods: {
    async submitForm() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          try {
            const autor = GetUser(); // Obtener el UUID del usuario logeado
            const ultimoAutor = GetUser(); // Puedes poner otro valor si prefieres tener diferente "autor" y "último autor"
  
            // Insertar el operador en la base de datos
            const { error } = await supabase.from('Operador').insert({
              nombre: this.form.nombre,
              apellidos: this.form.apellidos,
              fecha_nacimiento: this.form.fecha_nacimiento,
              nro_documento: this.form.nro_documento,
              nro_telefonico: this.form.nro_telefonico,
              Fk_tipodocumento: this.form.Fk_tipodocumento,
              correo_electronico: this.form.correo_electronico,
              autor: autor, // UUID del autor
              ultimo_autor: ultimoAutor // UUID del último autor
            });
  
            if (error) throw error;
            this.dialogVisible = true;  // Mostrar mensaje de éxito
            this.resetForm();           // Reiniciar formulario
          } catch (error) {
            console.error('Error al registrar operador:', error);
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
.register-operador-container {
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
