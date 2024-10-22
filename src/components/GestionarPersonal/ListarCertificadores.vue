<template>
    <div>
      <h2>Lista de Certificadores</h2>
      <button @click="crearNuevo">Crear Certificador</button>
      <ul>
        <li v-for="certificador in certificadores" :key="certificador.id">
          <span>{{ certificador.certificado_digital }}</span>
          <button @click="editarCertificador(certificador.id)">Editar</button>
          <button @click="eliminarCertificador(certificador.id)">Eliminar</button>
        </li>
      </ul>
      <p v-if="mensaje">{{ mensaje }}</p>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { supabase } from '@/supabase'; // Asegúrate de que la ruta es correcta
  
  export default {
    setup() {
      const certificadores = ref([]);
      const mensaje = ref('');
  
      const cargarCertificadores = async () => {
        const { data, error } = await supabase.from('certificador').select();
        if (error) {
          console.error('Error al cargar certificadores:', error.message);
          return;
        }
        certificadores.value = data;
      };
  
      const eliminarCertificador = async (id) => {
        const { error } = await supabase.from('certificador').delete().eq('id', id);
        if (error) {
          console.error('Error al eliminar certificador:', error.message);
          mensaje.value = 'Error al eliminar certificador';
          return;
        }
        mensaje.value = 'Certificador eliminado exitosamente';
        cargarCertificadores(); // Recargar la lista
      };
  
      const crearNuevo = () => {
        // Navegar a CrearCertificador.vue
        window.location.href = '/crear-certificador'; // Asegúrate de que la ruta sea correcta
      };
  
      const editarCertificador = (id) => {
        // Navegar a EditarCertificador.vue
        window.location.href = `/editar-certificador/${id}`; // Asegúrate de que la ruta sea correcta
      };
  
      onMounted(cargarCertificadores);
  
      return {
        certificadores,
        eliminarCertificador,
        crearNuevo,
        editarCertificador,
        mensaje,
      };
    },
  };
  </script>
  