<template>
  <el-form :model="form" label-width="120px">
    <el-form-item label="Nombre">
      <el-input v-model="form.Nombre" placeholder="Nombre"></el-input>
    </el-form-item>
    <el-form-item label="Tipo de Maquinaria">
      <el-select v-model="form.Tipo_De_Maquinaria_id" placeholder="Seleccionar Tipo de Maquinaria">
        <el-option v-for="maquinaria in maquinarias" :key="maquinaria.id" :label="maquinaria.descripcion" :value="maquinaria.id" />
      </el-select>
    </el-form-item>
    <el-form-item label="Descripción">
      <el-input v-model="form.Descripcion" placeholder="Descripción"></el-input>
    </el-form-item>
    <!-- Campo de carga de archivos -->
    <el-form-item label="Subir Imagen">
      <el-upload
        class="upload-demo"
        action="" 
        :on-change="handleFileChange"
        :file-list="fileList"
        :auto-upload="false"
        list-type="picture-card">
        <el-button>Seleccionar Imagen</el-button>
      </el-upload>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" class="neon-button" @click="handleSubmit">Guardar</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { ref, onMounted } from 'vue';
import { supabase } from '@/supabase'; // Asegúrate de tener configurada tu conexión a Supabase
import { GetUser, getJWT } from '../../auth'; // Tu lógica de autenticación para obtener el usuario actual

export default {
  setup(props, { emit }) {
    const form = ref({
      jwt: getJWT(), // Obtén el token JWT si es necesario para autenticación
      Nombre: '',
      Tipo_De_Maquinaria_id: null,
      Descripcion: '',
      URL_IMG: '', // Campo para almacenar la URL de la imagen
      userId: GetUser() // Asume que GetUser solo devuelve el ID del usuario actual
    });

    const maquinarias = ref([]); // Lista de tipos de maquinaria
    const fileList = ref([]); // Almacena la lista de archivos seleccionados
    const selectedFile = ref(null); // Para almacenar el archivo seleccionado

    // Captura el archivo seleccionado
    const handleFileChange = (file) => {
      selectedFile.value = file.raw; // Guarda el archivo en una variable
    };

    // Función para subir la imagen al bucket de Supabase
    const uploadImage = async () => {
      if (!selectedFile.value) return ''; // Si no hay archivo seleccionado, retorna vacío

      const filePath = `ImagenesServicios/${Date.now()}_${selectedFile.value.name}`; // Ruta en la carpeta
      const { error } = await supabase.storage
        .from('ImagenesServicios') // Reemplaza 'ImagenesServicios' con el nombre de tu bucket
        .upload(filePath, selectedFile.value);

      if (error) {
        console.error('Error al subir la imagen:', error.message);
        return '';
      }

      // Devuelve la URL pública de la imagen subida
      const { publicURL } = supabase.storage
        .from('ImagenesServicios') // Reemplaza con el nombre de tu bucket
        .getPublicUrl(filePath);

      return publicURL;
    };

    // Función para manejar el envío del formulario
    const handleSubmit = async () => {
      try {
        // Primero subimos la imagen si hay una
        const imageUrl = await uploadImage();
        form.value.URL_IMG = imageUrl;

        // Insertamos los datos en la base de datos
        const { data, error } = await supabase
          .from('tipo_de_inspeccion') // Reemplaza con el nombre de tu tabla
          .insert([
            {
              nombre: form.value.Nombre,
              tipo_de_maquinaria_id: form.value.Tipo_De_Maquinaria_id,
              descripcion: form.value.Descripcion,
              URL_IMG: form.value.URL_IMG, // Guardamos la URL de la imagen
              autor: form.value.userId,
              ultimo_autor: form.value.userId
            }
          ]);

        if (error) throw error;
        emit('created'); // Emite un evento para actualizar la lista de elementos si es necesario
      } catch (error) {
        console.error('Error al insertar:', error.message);
      }
    };

    // Función para obtener la lista de tipos de maquinaria
    const fetchMaquinarias = async () => {
      const { data, error } = await supabase
        .from('tipo_de_maquinaria') // Reemplaza con el nombre de tu tabla de maquinarias
        .select('id, descripcion');

      if (!error) {
        maquinarias.value = data; // Rellena la lista de maquinarias
      }
    };

    // Cuando se monta el componente, obtenemos los tipos de maquinaria
    onMounted(fetchMaquinarias);

    return {
      form,
      maquinarias,
      handleSubmit,
      handleFileChange,
      fileList
    };
  }
};
</script>

<style scoped>
/* Estilos personalizados para el formulario */

/* Contenedor de formulario */
.el-form {
  background-color: #f5f7fa; /* Fondo claro */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

/* Estilos para el campo de carga de imagen */
.upload-demo {
  width: 100%;
  margin-bottom: 20px;
}

/* Estilo para las tarjetas donde se carga la imagen */
.gestion-card img {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
}

/* Media queries para pantallas pequeñas */
@media screen and (max-width: 768px) {
  .el-form {
    padding: 15px;
  }
}
</style>
