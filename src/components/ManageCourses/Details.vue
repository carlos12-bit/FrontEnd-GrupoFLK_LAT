<template>
    <div class="container">
      <h1 class="page-title">Detalles del Curso</h1>
      <div v-if="curso" class="curso-detalles">
        <div class="detalle-item">
          <span class="detalle-label">ID del Curso:</span>
          <span class="detalle-valor">{{ curso.Pk_Curso }}</span>
        </div>
        <div class="detalle-item">
          <span class="detalle-label">Título del Curso:</span>
          <span class="detalle-valor">{{ curso.titulo_curso }}</span>
        </div>
        <div class="detalle-item">
          <span class="detalle-label">Docente Teoría:</span>
          <span class="detalle-valor">{{ docenteTeoria }}</span>
        </div>
        <div class="detalle-item">
          <span class="detalle-label">Docente Práctica:</span>
          <span class="detalle-valor">{{ docentePractica }}</span>
        </div>
        <div class="detalle-item">
          <span class="detalle-label">Ubicación Teoría:</span>
          <span class="detalle-valor">{{ ubicacionTeoria }}</span>
        </div>
        <div class="detalle-item">
          <span class="detalle-label">Ubicación Práctica:</span>
          <span class="detalle-valor">{{ ubicacionPractica }}</span>
        </div>
        <div class="detalle-item">
          <span class="detalle-label">Fecha y Hora Inicio Teoría:</span>
          <span class="detalle-valor">{{ curso.fecha_hora_inicio_teoria }}</span>
        </div>
        <div class="detalle-item">
          <span class="detalle-label">Fecha y Hora Fin Teoría:</span>
          <span class="detalle-valor">{{ curso.fecha_hora_fin_teoria }}</span>
        </div>
        <div class="detalle-item">
          <span class="detalle-label">Fecha y Hora Inicio Práctica:</span>
          <span class="detalle-valor">{{ curso.fecha_hora_inicio_practica }}</span>
        </div>
        <div class="detalle-item">
          <span class="detalle-label">Fecha y Hora Fin Práctica:</span>
          <span class="detalle-valor">{{ curso.fecha_hora_fin_practica }}</span>
        </div>
      </div>
      <div v-else class="loading">
        Cargando detalles del curso...
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { supabase } from '@/supabase.js';
  
  export default {
    name: "DetallesCurso",
    setup() {
      const route = useRoute();
      const curso = ref(null);
      const docenteTeoria = ref('');
      const docentePractica = ref('');
      const ubicacionTeoria = ref('');
      const ubicacionPractica = ref('');
  
      const fetchCourseDetails = async () => {
        try {
          const { data, error } = await supabase
            .from('Cursos')
            .select('*')
            .eq('Pk_Curso', route.query.id)
            .single();
  
          if (error) throw error;
          curso.value = data;
          await fetchRelatedData(data);
        } catch (error) {
          console.error("Error al obtener los detalles del curso:", error);
        }
      };
  
      const fetchRelatedData = async (cursoData) => {
        try {
          const { data: docenteTeoriaData } = await supabase
            .from('Formador')
            .select('nombre')
            .eq('Pk_docenteteoria', cursoData.Fk_docenteteoria)
            .single();
          docenteTeoria.value = docenteTeoriaData?.nombre || 'Sin asignar';
  
          const { data: docentePracticaData } = await supabase
            .from('Instructor')
            .select('nombre')
            .eq('Pk_docentepractico', cursoData.Fk_docentepractico)
            .single();
          docentePractica.value = docentePracticaData?.nombre || 'Sin asignar';
  
          const { data: ubicacionTeoriaData } = await supabase
            .from('Ubicaciones')
            .select('nombre_ubicacion')
            .eq('Pk_Ubicacion', cursoData.Fk_ubicacion_teoria)
            .single();
          ubicacionTeoria.value = ubicacionTeoriaData?.nombre_ubicacion || 'Sin asignar';
  
          const { data: ubicacionPracticaData } = await supabase
            .from('Ubicaciones')
            .select('nombre_ubicacion')
            .eq('Pk_Ubicacion', cursoData.Fk_ubicacion_practica)
            .single();
          ubicacionPractica.value = ubicacionPracticaData?.nombre_ubicacion || 'Sin asignar';
        } catch (error) {
          console.error("Error al obtener datos relacionados:", error);
        }
      };
  
      onMounted(() => {
        fetchCourseDetails();
      });
  
      return {
        curso,
        docenteTeoria,
        docentePractica,
        ubicacionTeoria,
        ubicacionPractica
      };
    }
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 800px;
    margin: 2rem auto;
    padding: 2rem;
    background-color: #ffffff;
    border-radius: 15px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  }
  
  .page-title {
    text-align: center;
    font-size: 2rem;
    font-weight: bold;
    color: #2c3e50;
    margin-bottom: 1.5rem;
  }
  
  .curso-detalles {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .detalle-item {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    background-color: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 10px;
  }
  
  .detalle-label {
    font-weight: bold;
    color: #34495e;
  }
  
  .detalle-valor {
    color: #5d6d7e;
  }
  
  .loading {
    text-align: center;
    font-size: 1.2rem;
    color: #5d6d7e;
  }
  
  button {
    background-color: #3498db;
    color: #fff;
    padding: 0.6rem 1.2rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  button:hover {
    background-color: #2980b9;
  }
  </style>
  
  
  