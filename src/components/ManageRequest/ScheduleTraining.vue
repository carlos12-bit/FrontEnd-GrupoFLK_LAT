<template>
  <div class="container">
    <h1 class="page-title">Capacitación Cursos</h1>
    <table class="table">
      <thead>
        <tr>
          <th>Curso</th>
          <th>Operador</th>
          <th>Título</th>
          <th>Fecha Inicio</th>
          <th>Fecha Fin</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="curso in capacitaciones" :key="curso.pk_capacitacion">
          <td>{{ getNombreCurso(curso.fk_curso) }}</td>
          <td>{{ getNombreOperador(curso.fk_operador) }}</td>
          <td>{{ curso.titulo }}</td>
          <td>{{ formatFecha(curso.fecha_inicio) }}</td>
          <td>{{ formatFecha(curso.fecha_fin) }}</td>
          <td>
            <span :class="curso.estado ? 'status-active' : 'status-inactive'">
              {{ curso.estado ? 'Activo' : 'Inactivo' }}
            </span>
          </td>
          <td>
            <button @click="abrirVerModal(curso)" class="btn btn-primary">
              <i class="fas fa-eye"></i>
            </button>
            <button @click="abrirActualizarModal(curso)" class="btn btn-success">
              <i class="fas fa-edit"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal Ver -->
    <div v-if="mostrarVerModal" class="modal-overlay">
      <div class="modal-content">
        <h2 class="modal-title">Detalles de Capacitación</h2>
        <div class="modal-body">
          <p><strong>Curso:</strong> {{ getNombreCurso(cursoSeleccionado.fk_curso) }}</p>
          <p><strong>Operador:</strong> {{ getNombreOperador(cursoSeleccionado.fk_operador) }}</p>
          <p><strong>Título:</strong> {{ cursoSeleccionado.titulo }}</p>
          <p><strong>Fecha Inicio:</strong> {{ formatFecha(cursoSeleccionado.fecha_inicio) }}</p>
          <p><strong>Fecha Fin:</strong> {{ formatFecha(cursoSeleccionado.fecha_fin) }}</p>
          <p>
            <strong>Estado:</strong>
            <span :class="cursoSeleccionado.estado ? 'status-active' : 'status-inactive'">
              {{ cursoSeleccionado.estado ? 'Activo' : 'Inactivo' }}
            </span>
          </p>
        </div>
        <div class="modal-footer">
          <button @click="cerrarVerModal" class="btn btn-danger">Cerrar</button>
        </div>
      </div>
    </div>

    <!-- Modal Actualizar -->
    <div v-if="mostrarActualizarModal" class="modal-overlay">
      <div class="modal-content">
        <h2 class="modal-title">Actualizar Capacitación</h2>
        <form @submit.prevent="actualizarCapacitacion">
          <div class="form-group">
            <label for="curso">Curso</label>
            <select v-model="cursoSeleccionado.fk_curso" id="curso">
              <option v-for="curso in cursos" :key="curso.pk_curso" :value="curso.pk_curso">
                {{ curso.titulo_curso }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="operador">Operador</label>
            <select v-model="cursoSeleccionado.fk_operador" id="operador">
              <option v-for="operador in operadores" :key="operador.pk_operador" :value="operador.pk_operador">
                {{ operador.nombre }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="titulo">Título</label>
            <input type="text" v-model="cursoSeleccionado.titulo" id="titulo" />
          </div>
          <div class="form-group">
            <label for="fecha_inicio">Fecha Inicio</label>
            <input type="date" v-model="cursoSeleccionado.fecha_inicio" id="fecha_inicio" />
          </div>
          <div class="form-group">
            <label for="fecha_fin">Fecha Fin</label>
            <input type="date" v-model="cursoSeleccionado.fecha_fin" id="fecha_fin" />
          </div>
          <div class="form-group">
            <label>Estado</label>
            <div>
              <label><input type="radio" value="true" v-model="cursoSeleccionado.estado" /> Activo</label>
              <label><input type="radio" value="false" v-model="cursoSeleccionado.estado" /> Inactivo</label>
            </div>
          </div>
          <div class="modal-footer">
            <button type="submit" class="btn btn-success">Guardar</button>
            <button type="button" @click="cerrarActualizarModal" class="btn btn-danger">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { supabase } from "@/supabase.js";

export default {
  setup() {
    const capacitaciones = ref([]);
    const cursos = ref([]);
    const operadores = ref([]);
    const mostrarVerModal = ref(false);
    const mostrarActualizarModal = ref(false);
    const cursoSeleccionado = ref(null);

    const fetchCapacitaciones = async () => {
      const { data, error } = await supabase.from("capacitacion_cursos").select("*");
      if (error) console.error(error);
      capacitaciones.value = data;
    };

    const fetchCursos = async () => {
      const { data, error } = await supabase.from("cursos").select("*");
      if (error) console.error(error);
      cursos.value = data;
    };

    const fetchOperadores = async () => {
      const { data, error } = await supabase.from("Operador").select("*");
      if (error) console.error(error);
      operadores.value = data;
    };

    const getNombreCurso = (fk_curso) => {
      const curso = cursos.value.find((c) => c.pk_curso === fk_curso);
      return curso ? curso.titulo_curso : "Curso no encontrado";
    };

    const getNombreOperador = (fk_operador) => {
      const operador = operadores.value.find((o) => o.pk_operador === fk_operador);
      return operador ? operador.nombre : "Operador no encontrado";
    };

    const formatFecha = (fecha) => {
      return new Date(fecha).toLocaleDateString();
    };

    const abrirVerModal = (curso) => {
      cursoSeleccionado.value = { ...curso };
      mostrarVerModal.value = true;
    };

    const cerrarVerModal = () => {
      mostrarVerModal.value = false;
    };

    const abrirActualizarModal = (curso) => {
      cursoSeleccionado.value = { ...curso };
      mostrarActualizarModal.value = true;
    };

    const cerrarActualizarModal = () => {
      mostrarActualizarModal.value = false;
    };

    const actualizarCapacitacion = async () => {
      const { error } = await supabase
        .from("capacitacion_cursos")
        .update(cursoSeleccionado.value)
        .eq("pk_capacitacion", cursoSeleccionado.value.pk_capacitacion);
      if (error) {
        console.error(error);
      } else {
        alert("Capacitación actualizada con éxito");
        cerrarActualizarModal();
        fetchCapacitaciones();
      }
    };

    onMounted(() => {
      fetchCapacitaciones();
      fetchCursos();
      fetchOperadores();
    });

    return {
      capacitaciones,
      cursos,
      operadores,
      mostrarVerModal,
      mostrarActualizarModal,
      cursoSeleccionado,
      abrirVerModal,
      cerrarVerModal,
      abrirActualizarModal,
      cerrarActualizarModal,
      actualizarCapacitacion,
      getNombreCurso,
      getNombreOperador,
      formatFecha,
    };
  },
};
</script>

<style scoped>
/* Nuevas clases de estado */
.status-active {
  color: #28a745;
  font-weight: bold;
}

.status-inactive {
  color: #dc3545;
  font-weight: bold;
}

/* Botones reutilizables */
.btn {
  padding: 0.5rem 1rem;
  border-radius: 5px;
  font-size: 0.9rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-success {
  background-color: #28a745;
  color: white;
}

.btn-success:hover {
  background-color: #218838;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
}
</style>

<!-- <style>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Títulos */
.page-title {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  color: #333;
  margin-bottom: 1.5rem;
}

/* Tabla */
.table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
}

.table th {
  background-color: #007bff;
  color: white;
  text-align: left;
  padding: 0.75rem;
  font-size: 1rem;
}

.table td {
  padding: 0.75rem;
  border-bottom: 1px solid #eaeaea;
  text-align: left;
  font-size: 0.95rem;
}

.table tr:nth-child(even) td {
  background-color: #f4f4f4;
}

.table tr:hover td {
  background-color: #e9f5ff;
  transition: background-color 0.2s ease;
}

/* Botones */
.btn-ver {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-ver:hover {
  background-color: #0056b3;
}

.btn-actualizar {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-actualizar:hover {
  background-color: #218838;
}

/* Modales */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 1.5rem;
  border-radius: 10px;
  width: 500px;
  max-width: 90%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.modal-title {
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1rem;
}

.modal-body {
  font-size: 1rem;
  color: #333;
  margin-bottom: 1rem;
}

.modal-body p {
  margin: 0.5rem 0;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.btn-cerrar {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-cerrar:hover {
  background-color: #c82333;
}

.btn-guardar {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-guardar:hover {
  background-color: #218838;
}

/* Formularios */
.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  font-size: 0.95rem;
  font-weight: bold;
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  color: #333;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

/* Animaciones */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-content {
  animation: fadeIn 0.3s ease-out;
}
</style> -->