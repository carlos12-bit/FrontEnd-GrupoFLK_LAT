<template>
    <div class="container">
      <h2 class="title">Registrar Nuevo Curso</h2>
      <form @submit.prevent="registrarCurso" class="form">
        <div class="form-group">
          <label for="titulo">Título del Curso</label>
          <input v-model="curso.titulo" type="text" id="titulo" placeholder="Ingresa el título del curso" required />
        </div>
  
        <div class="form-group">
          <label for="docenteTeoria">Formador (Docente Teoría)</label>
          <select v-model="curso.docenteTeoria" id="docenteTeoria" required>
            <option value="" disabled>Selecciona un formador</option>
            <option v-for="formador in formadores" :key="formador.Pk_docenteteoria" :value="formador.Pk_docenteteoria">
              {{ formador.nombre }}
            </option>
          </select>
        </div>
  
        <div class="form-group">
          <label for="docentePractica">Instructor (Docente Práctica)</label>
          <select v-model="curso.docentePractica" id="docentePractica" required>
            <option value="" disabled>Selecciona un instructor</option>
            <option v-for="instructor in instructores" :key="instructor.Pk_docentepractico" :value="instructor.Pk_docentepractico">
              {{ instructor.nombre }}
            </option>
          </select>
        </div>
  
        <div class="form-group">
          <label for="ubicacionTeoria">Ubicación Teoría</label>
          <select v-model="curso.ubicacionTeoria" id="ubicacionTeoria" required>
            <option value="" disabled>Selecciona una ubicación</option>
            <option v-for="ubicacion in ubicaciones" :key="ubicacion.Pk_Ubicacion" :value="ubicacion.Pk_Ubicacion">
              {{ ubicacion.nombre_ubicacion }}
            </option>
          </select>
        </div>
  
        <div class="form-group">
          <label for="Ubicaciones">Ubicación Práctica</label>
          <select v-model="curso.ubicacionPractica" id="Pk_Ubicacion" required>
            <option value="" disabled>Selecciona una ubicación</option>
            <option v-for="ubicacion in ubicaciones" :key="ubicacion.Pk_Ubicacion" :value="ubicacion.Pk_Ubicacion">
              {{ ubicacion.nombre_ubicacion }}
            </option>
          </select>
        </div>
  
        <div class="form-group">
          <label for="fechaInicioTeoria">Inicio Teoría</label>
          <input v-model="curso.fechaInicioTeoria" type="datetime-local" id="fechaInicioTeoria" required />
        </div>
  
        <div class="form-group">
          <label for="fechaFinTeoria">Fin Teoría</label>
          <input v-model="curso.fechaFinTeoria" type="datetime-local" id="fechaFinTeoria" required />
        </div>
  
        <div class="form-group">
          <label for="fechaInicioPractica">Inicio Práctica</label>
          <input v-model="curso.fechaInicioPractica" type="datetime-local" id="fechaInicioPractica" required />
        </div>
  
        <div class="form-group">
          <label for="fechaFinPractica">Fin Práctica</label>
          <input v-model="curso.fechaFinPractica" type="datetime-local" id="fechaFinPractica" required />
        </div>
  
        <button type="submit" class="btn">Registrar Curso</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        curso: {
          titulo: '',
          docenteTeoria: '',
          docentePractica: '',
          ubicacionTeoria: '',
          ubicacionPractica: '',
          fechaInicioTeoria: '',
          fechaFinTeoria: '',
          fechaInicioPractica: '',
          fechaFinPractica: '',
        },
        formadores: [],
        instructores: [],
        ubicaciones: [],
      };
    },
    async mounted() {
      await this.cargarFormadores();
      await this.cargarInstructores();
      await this.cargarUbicaciones();
    },
    methods: {
    async cargarFormadores() {
      const { data, error } = await this.$supabase
        .from('Formador')
        .select('Pk_docenteteoria,nombre');
      if (error) {
        console.error('Error cargando formadores:', error);
      } else {
        console.log('Formadores obtenidos:', data);
        this.formadores = data;
      }
    },
    async cargarInstructores() {
      const { data, error } = await this.$supabase
        .from('Instructor')
        .select('Pk_docentepractico,nombre');
      if (error) {
        console.error('Error cargando instructores:', error);
      } else {
        console.log('Instructores obtenidos:', data);
        this.instructores = data;
      }
    },
    async cargarUbicaciones() {
      const { data, error } = await this.$supabase
        .from('Ubicaciones')
        .select('Pk_Ubicacion,nombre_ubicacion');
      if (error) {
        console.error('Error cargando ubicaciones:', error);
      } else {
        console.log('Ubicaciones obtenidas:', data);
        this.ubicaciones = data;
      }
    },
      async registrarCurso() {
        try {
          const { data, error } = await this.$supabase
            .from('cursos')
            .insert([this.curso]);
  
          if (error) {
            alert('Error al registrar el curso: ' + error.message);
          } else {
            alert('Curso registrado exitosamente');
            this.curso = {
              titulo: '',
              docenteTeoria: '',
              docentePractica: '',
              ubicacionTeoria: '',
              ubicacionPractica: '',
              fechaInicioTeoria: '',
              fechaFinTeoria: '',
              fechaInicioPractica: '',
              fechaFinPractica: '',
            };
          }
        } catch (error) {
          console.error(error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .title {
    text-align: center;
    margin-bottom: 20px;
    color: #333;
  }
  
  .form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
  }
  
  label {
    margin-bottom: 5px;
    font-weight: bold;
    color: #555;
  }
  
  input,
  select {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  input:focus,
  select:focus {
    border-color: #007bff;
    outline: none;
  }
  
  .btn {
    padding: 10px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .btn:hover {
    background: #0056b3;
  }
  </style>