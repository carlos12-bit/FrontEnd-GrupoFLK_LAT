<template>
  <div class="container">
    <h1 class="page-title">Gestión de Cursos</h1>
    <button @click="goToCreateCourse" class="btn-create">Crear Curso</button>
    <table class="courses-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Título</th>
          <th>Docente Teoría</th>
          <th>Docente Práctica</th>
          <th>Ubicación Teoría</th>
          <th>Ubicación Práctica</th>
          <th>Opciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="curso in cursos" :key="curso.pk_curso">
          <td>{{ curso.pk_curso }}</td>
          <td>{{ curso.titulo_curso }}</td>
          <td>{{ getNombreFormador(curso.fk_docenteteoria) }}</td>
          <td>{{ getNombreInstructor(curso.fk_docentepractico) }}</td>
          <td>{{ getUbicacionTeoria(curso.fk_ubicacion_teoria) }}</td>
          <td>{{ getUbicacionPractica(curso.fk_ubicacion_practica) }}</td>
          <td>
            <button @click="viewCourse(curso.pk_curso)" class="view-btn">Ver</button>
            <button @click="goToEditCourse(curso.pk_curso)" class="edit-btn">Editar</button>
            <button @click="deleteCourse(curso.pk_curso)" class="delete-btn">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { supabase } from '@/supabase.js';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    const cursos = ref([]);
    const formadores = ref([]);
    const instructores = ref([]);
    const ubicaciones = ref([]);

    const fetchCourses = async () => {
      let { data: Cursos, error } = await supabase.from('cursos').select('*');
      if (!error) cursos.value = Cursos;
      else console.error('Error al obtener los cursos:', error.message);
    };

    const fetchFormadores = async () => {
      let { data: Formador, error } = await supabase.from('Formador').select('*');
      if (!error) formadores.value = Formador;
      else console.error('Error al obtener formadores:', error.message);
    };

    const fetchInstructores = async () => {
      let { data: Instructor, error } = await supabase.from('Instructor').select('*');
      if (!error) instructores.value = Instructor;
      else console.error('Error al obtener instructores:', error.message);
    };

    const fetchUbicaciones = async () => {
      let { data: Ubicaciones, error } = await supabase.from('Ubicaciones').select('*');
      if (!error) ubicaciones.value = Ubicaciones;
      else console.error('Error al obtener ubicaciones:', error.message);
    };

    const getNombreFormador = (fk_docenteteoria) => {
      const formador = formadores.value.find(f => f.Pk_docenteteoria === fk_docenteteoria);
      return formador ? formador.nombre : 'Sin asignar';
    };

    const getNombreInstructor = (fk_docentepractico) => {
      const instructor = instructores.value.find(i => i.Pk_docentepractico === fk_docentepractico);
      return instructor ? instructor.nombre : 'Sin asignar';
    };

    const getUbicacionTeoria = (fk_ubicacion_teoria) => {
      const ubicacion = ubicaciones.value.find(u => u.Pk_Ubicacion === fk_ubicacion_teoria);
      return ubicacion ? ubicacion.nombre_ubicacion : 'Sin asignar';
    };

    const getUbicacionPractica = (fk_ubicacion_practica) => {
      const ubicacion = ubicaciones.value.find(u => u.Pk_Ubicacion === fk_ubicacion_practica);
      return ubicacion ? ubicacion.nombre_ubicacion : 'Sin asignar';
    };

    const viewCourse = (id) => {
      router.push({ path: 'ManageCourses/Details', query: { id } });
    };

    const goToCreateCourse = () => {
      router.push('ManageCourses/Create');
    };

    const goToEditCourse = (id) => {
      router.push({ path: 'ManageCourses/Edit', query: { id } });
    };

    const deleteCourse = async (id) => {
      const { error } = await supabase.from('cursos').delete().eq('pk_curso', id);
      if (!error) {
        cursos.value = cursos.value.filter(curso => curso.pk_curso !== id);
        alert('Curso eliminado con éxito');
      } else {
        alert('Error al eliminar el curso');
      }
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
      getUbicacionTeoria,
      getUbicacionPractica,
      viewCourse,
      goToCreateCourse,
      goToEditCourse,
      deleteCourse
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

.btn-create {
  background-color: #3498db;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 1rem;
}

.btn-create:hover {
  background-color: #2980b9;
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

.view-btn, .edit-btn, .delete-btn {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 5px;
}

.view-btn:hover, .edit-btn:hover, .delete-btn:hover {
  background-color: #2980b9;
}
</style>
