<template>
  <div class="container">
    <h1 class="page-title">Gestión de Cursos</h1>
    <table class="courses-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Título</th>
          <th>Docente Teoría</th>
          <th>Docente Práctica</th>
          <th>Ubicación Teoría</th>
          <th>Ubicación Práctica</th>
          <th>Fecha Inicio Teoría</th>
          <th>Fecha Fin Teoría</th>
          <th>Opciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="curso in cursos" :key="curso.Pk_Curso">
          <td>{{ curso.Pk_Curso }}</td>
          <td>{{ curso.titulo_curso }}</td>
          <td>{{ getNombreFormador(curso.Fk_docenteteoria) }}</td>
          <td>{{ getNombreInstructor(curso.Fk_docentepractico) }}</td>
          <td>{{ getNombreUbicacion(curso.Fk_ubicacion_teoria) }}</td>
          <td>{{ getNombreUbicacionPractica(curso.Fk_ubicacion_practica) }}</td>
          <td>{{ new Date(curso.fecha_hora_inicio_teoria).toLocaleDateString() }}</td>
          <td>{{ new Date(curso.fecha_hora_fin_teoria).toLocaleDateString() }}</td>
          <td>
            <button @click="viewCourse(curso)" class="view-btn">Ver</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { supabase } from '@/supabase.js';

export default {
  setup() {
    const cursos = ref([]);
    const formadores = ref([]);
    const instructores = ref([]);
    const ubicaciones = ref([]);

    const fetchCourses = async () => {
      let { data: Cursos, error } = await supabase.from('Cursos').select('*');
      if (!error) cursos.value = Cursos;
    };

    const fetchFormadores = async () => {
      let { data: Formador, error } = await supabase.from('Formador').select('*');
      if (!error) formadores.value = Formador;
    };

    const fetchInstructores = async () => {
      let { data: Instructor, error } = await supabase.from('Instructor').select('*');
      if (!error) instructores.value = Instructor;
    };

    const fetchUbicaciones = async () => {
      let { data: Ubicaciones, error } = await supabase.from('Ubicaciones').select('*');
      if (!error) ubicaciones.value = Ubicaciones;
    };

    const getNombreFormador = (fk_docenteteoria) => {
      const formador = formadores.value.find(f => f.Pk_docenteteoria === fk_docenteteoria);
      return formador ? formador.nombre : 'Sin asignar';
    };

    const getNombreInstructor = (fk_docentepractico) => {
      const instructor = instructores.value.find(i => i.Pk_docentepractico === fk_docentepractico);
      return instructor ? instructor.nombre : 'Sin asignar';
    };

    const getNombreUbicacion = (fk_ubicacion_teoria) => {
      const ubicacion = ubicaciones.value.find(u => u.Pk_Ubicacion === fk_ubicacion_teoria);
      return ubicacion ? ubicacion.nombre_ubicacion : 'Sin asignar';
    };

    const getNombreUbicacionPractica = (fk_ubicacion_practica) => {
      const ubicacion = ubicaciones.value.find(u => u.Pk_Ubicacion === fk_ubicacion_practica);
      return ubicacion && ubicacion.tipo_ubicacion === 'presencial' ? ubicacion.nombre_ubicacion : 'Sin asignar';
    };

    const viewCourse = (curso) => {
      alert(`Detalles del curso: ${curso.titulo_curso}`);
    };

    onMounted(() => {
      fetchCourses();
      fetchFormadores();
      fetchInstructores();
      fetchUbicaciones();
    });

    return {
      cursos,
      getNombreFormador,
      getNombreInstructor,
      getNombreUbicacion,
      getNombreUbicacionPractica,
      viewCourse
    };
  }
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f4f4f9;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.page-title {
  font-size: 2rem;
  color: #333;
  text-align: center;
  margin-bottom: 1rem;
}

.courses-table {
  width: 100%;
  border-collapse: collapse;
}

.courses-table th, .courses-table td {
  border: 1px solid #ccc;
  padding: 0.75rem;
  text-align: left;
}

.courses-table th {
  background-color: #f4f4f4;
  font-weight: bold;
}

.view-btn {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
}

.view-btn:hover {
  background-color: #2980b9;
}
</style>
