<template>
  <div class="container">
    <h1>Evaluaciones Teóricas</h1>
    <div class="card-grid">
      <div v-for="curso in cursosAsignados" :key="curso.pk_asignatura" class="card">
        <h2>{{ curso.nombre_curso || "Curso no encontrado" }}</h2>
        <p>Puntaje: {{ curso.puntaje || "%" }}</p>
        <button class="btn" @click="iniciarEvaluacion(curso)">Iniciar Evaluación</button>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from '@/supabase.js';

export default {
  data() {
    return {
      cursosAsignados: [],
    };
  },
  methods: {
    async fetchCursosAsignados() {
      const operadorId = 1; // Reemplaza con el ID del operador autenticado
      const { data, error } = await supabase
        .from("asignatura")
        .select(`
          pk_asigantura,
          fk_curso,
          cursos(titulo_curso)
        `)
        .eq("fk_operador", operadorId);

      if (error) {
        console.error(error);
      } else {
        this.cursosAsignados = data.map((curso) => ({
          ...curso,
          nombre_curso: curso.cursos?.nombre_curso,
        }));
      }
    },
    iniciarEvaluacion(curso) {
      this.$router.push({ name: "RealizarEvaluacion", params: { cursoId: curso.fk_curso } });
    },
  },
  mounted() {
    this.fetchCursosAsignados();
  },
};
</script>

<style>
.container {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin: 20px 0;
}
.card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
.card h2 {
  margin: 0 0 10px;
}
.card p {
  font-size: 16px;
  color: #555;
}
.btn {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>


