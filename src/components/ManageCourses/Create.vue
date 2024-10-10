<template>
  <div class="courses-container">
    <div class="sidebar">
      <div class="logo">
        <h2>Mi Dashboard</h2>
      </div>
      <nav>
        <ul>
          <li>
            <router-link to="/dashboard" class="nav-link">
              <i class="fas fa-home"></i> Inicio
            </router-link>
          </li>
          <li>
            <router-link to="/profile" class="nav-link">
              <i class="fas fa-user"></i> Perfil
            </router-link>
          </li>
          <li>
            <router-link to="/settings" class="nav-link">
              <i class="fas fa-cog"></i> Configuración
            </router-link>
          </li>
          <li>
            <router-link to="/reports" class="nav-link">
              <i class="fas fa-chart-bar"></i> Reportes
            </router-link>
          </li>
          <li>
            <router-link to="/manage-requests" class="nav-link">
              <i class="fas fa-tasks"></i> Gestionar Solicitudes
            </router-link>
          </li>
          <li>
            <router-link to="/manage-courses" class="nav-link">
              <i class="fas fa-book"></i> Gestionar Cursos
            </router-link>
          </li>
          <li>
            <button @click="logout" class="nav-link logout-btn">
              <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
            </button>
          </li>
        </ul>
      </nav>
    </div>

    <div class="main-content">
      <h2>Gestión de Cursos</h2>
      <!-- Formulario para crear curso -->
      <div class="form-container">
        <h3>Crear Curso</h3>
        <form @submit.prevent="createCourse">
          <!-- Título del curso -->
          <div class="form-group">
            <label for="titulo_curso">Título del Curso:</label>
            <input v-model="titulo_curso" type="text" id="titulo_curso" required />
          </div>

          <!-- Docente Teoría -->
          <div class="form-group">
            <label for="docente_teoria">Docente Teoría:</label>
            <select v-model="Fk_docenteteoria" id="docente_teoria" required>
              <option v-for="docente in docentesTeoria" :key="docente.Pk_docenteteoria" :value="docente.Pk_docenteteoria">
                {{ docente.nombre }}
              </option>
            </select>
          </div>

          <!-- Docente Práctica -->
          <div class="form-group">
            <label for="docente_practica">Docente Práctica:</label>
            <select v-model="Fk_docentepractico" id="docente_practica" required>
              <option v-for="docente in docentesPractica" :key="docente.Pk_docentepractico" :value="docente.Pk_docentepractico">
                {{ docente.nombre }}
              </option>
            </select>
          </div>

          <!-- Ubicación Teoría -->
          <div class="form-group">
            <label for="ubicacion_teoria">Ubicación Teoría:</label>
            <select v-model="Fk_ubicacion_teoria" id="ubicacion_teoria" required>
              <option v-for="ubicacion in ubicaciones" :key="ubicacion.Pk_Ubicacion" :value="ubicacion.Pk_Ubicacion">
                {{ ubicacion.nombre_ubicacion }}
              </option>
            </select>
          </div>

          <!-- Ubicación Práctica -->
          <div class="form-group">
            <label for="ubicacion_practica">Ubicación Práctica:</label>
            <input v-model="Fk_ubicacion_practica" type="text" id="ubicacion_practica" required />
          </div>

          <!-- Fecha y Hora Inicio Teoría -->
          <div class="form-group">
            <label for="fecha_hora_inicio_teoria">Fecha y Hora Inicio Teoría:</label>
            <input v-model="fecha_hora_inicio_teoria" type="datetime-local" id="fecha_hora_inicio_teoria" required />
          </div>

          <!-- Fecha y Hora Fin Teoría -->
          <div class="form-group">
            <label for="fecha_hora_fin_teoria">Fecha y Hora Fin Teoría:</label>
            <input v-model="fecha_hora_fin_teoria" type="datetime-local" id="fecha_hora_fin_teoria" required />
          </div>

          <!-- Fecha y Hora Inicio Práctica -->
          <div class="form-group">
            <label for="fecha_hora_inicio_practica">Fecha y Hora Inicio Práctica:</label>
            <input v-model="fecha_hora_inicio_practica" type="datetime-local" id="fecha_hora_inicio_practica" required />
          </div>

          <!-- Fecha y Hora Fin Práctica -->
          <div class="form-group">
            <label for="fecha_hora_fin_practica">Fecha y Hora Fin Práctica:</label>
            <input v-model="fecha_hora_fin_practica" type="datetime-local" id="fecha_hora_fin_practica" required />
          </div>

          <!-- Botón para crear curso -->
          <button type="submit" class="btn-create">Crear Curso</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'; // Importamos useRouter
import { supabase } from '@/supabase.js';

export default {
  setup() {
    const router = useRouter(); // Obtenemos la instancia del router
    const titulo_curso = ref('');
    const Fk_docenteteoria = ref(null);
    const Fk_docentepractico = ref(null);
    const Fk_ubicacion_teoria = ref('');
    const Fk_ubicacion_practica = ref('');
    const fecha_hora_inicio_teoria = ref(null);
    const fecha_hora_fin_teoria = ref(null);
    const fecha_hora_inicio_practica = ref(null);
    const fecha_hora_fin_practica = ref(null);

    const docentesTeoria = ref([]);
    const docentesPractica = ref([]);
    const ubicaciones = ref([]); // Ubicaciones obtenidas de la base de datos

    // Función para obtener los docentes de teoría de la tabla 'Formador'
    const fetchDocentesTeoria = async () => {
      let { data: docentes, error } = await supabase
        .from('Formador')
        .select('Pk_docenteteoria, nombre');
      if (!error) {
        docentesTeoria.value = docentes;
      } else {
        console.error('Error al obtener docentes de teoría:', error);
      }
    };

    // Función para obtener los docentes de práctica de la tabla 'Instructor'
    const fetchDocentesPractica = async () => {
      let { data: docentes, error } = await supabase
        .from('Instructor')
        .select('Pk_docentepractico, nombre');
      if (!error) {
        docentesPractica.value = docentes;
      } else {
        console.error('Error al obtener docentes de práctica:', error);
      }
    };

    // Función para obtener las ubicaciones
    const fetchUbicaciones = async () => {
      let { data: ubicacionesData, error } = await supabase
        .from('Ubicaciones')
        .select('Pk_Ubicacion, nombre_ubicacion');
      if (!error) {
        ubicaciones.value = ubicacionesData;
      } else {
        console.error('Error al obtener las ubicaciones:', error);
      }
    };

    // Llamar a las funciones al montar el componente
    onMounted(() => {
      fetchDocentesTeoria();
      fetchDocentesPractica();
      fetchUbicaciones(); // Llamamos a la función para obtener las ubicaciones
    });

    // Función para crear un curso
    const createCourse = async () => {
      const { error } = await supabase
        .from('Cursos')
        .insert({
          titulo_curso: titulo_curso.value,
          Fk_docenteteoria: Fk_docenteteoria.value,
          Fk_docentepractico: Fk_docentepractico.value,
          Fk_ubicacion_teoria: Fk_ubicacion_teoria.value,
          Fk_ubicacion_practica: Fk_ubicacion_practica.value,
          fecha_hora_inicio_teoria: fecha_hora_inicio_teoria.value,
          fecha_hora_fin_teoria: fecha_hora_fin_teoria.value,
          fecha_hora_inicio_practica: fecha_hora_inicio_practica.value,
          fecha_hora_fin_practica: fecha_hora_fin_practica.value,
        });

      if (error) {
        console.error('Error al crear el curso:', error.message);
      } else {
        alert('Curso creado con éxito');
        router.push({ path: '/manage-courses'}); // Redirigir a la vista de gestión de cursos
      }
    };

    return {
      titulo_curso,
      Fk_docenteteoria,
      Fk_docentepractico,
      Fk_ubicacion_teoria,
      Fk_ubicacion_practica,
      fecha_hora_inicio_teoria,
      fecha_hora_fin_teoria,
      fecha_hora_inicio_practica,
      fecha_hora_fin_practica,
      docentesTeoria,
      docentesPractica,
      ubicaciones, // Retornar las ubicaciones
      createCourse,
    };
  },
};
</script>

<style scoped>
/* Barra lateral */
.sidebar {
  width: 250px;
  height: 100vh;
  background-color: #333;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  position: fixed;
}

.logo h2 {
  color: #fff;
  font-size: 24px;
  margin-bottom: 20px;
}

nav ul {
  list-style: none;
  padding: 0;
  width: 100%;
}

nav ul li {
  width: 100%;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  color: #fff;
  text-decoration: none;
  font-size: 16px;
  transition: background-color 0.3s;
}

.nav-link i {
  margin-right: 10px;
}

.nav-link:hover {
  background-color: #444;
}

.logout-btn {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  text-align: left;
  width: 100%;
  padding: 15px 20px;
  font-size: 16px;
  transition: background-color 0.3s;
}

.logout-btn:hover {
  background-color: #444;
}

/* Contenido principal */
.main-content {
  margin-left: 270px;
  padding: 20px;
}

h2 {
  font-size: 28px;
  margin-bottom: 20px;
}

/* Formulario */
.form-container {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

input,
select {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

input:focus,
select:focus {
  border-color: #3498db;
  outline: none;
}

/* Botón crear curso */
.btn-create {
  background-color: #3498db;
  color: white;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.btn-create:hover {
  background-color: #2980b9;
}
</style>
