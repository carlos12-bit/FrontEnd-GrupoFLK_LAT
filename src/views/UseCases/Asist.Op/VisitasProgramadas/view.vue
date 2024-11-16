<template>
  <RealizarVisitaInspector class="animate__animated animate__bounceIn"/>
  <RealizarVisitaCertificador class="animate__animated animate__bounceIn"/>
</template>
<script>
import RealizarVisitaInspector from '@/components/RealizarVisitaInspector/Listar.vue';
import RealizarVisitaCertificador from '@/components/RealizarVisitaCertificador/Listar.vue';

export default {
  components: {
    RealizarVisitaInspector,
    RealizarVisitaCertificador
  }
}


</script>