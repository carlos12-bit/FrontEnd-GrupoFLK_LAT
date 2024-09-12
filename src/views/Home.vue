<template>
  <navbar></navbar>
    <div class="home">
      <div class="jumbotron text-center" style="background-color: #8C3A1C; color: white;">
        <h1 class="display-4">Inspección de Maquinaria Pesada Y ligera</h1>
        <p class="lead">Ofrecemos servicios de inspección para montacargas, grúas y más.</p>
        <hr class="my-4" style="border-color: #BF5630;">
        <router-link to="/services" class="btn btn-primary btn-lg">Nuestros Servicios</router-link>
      </div>
    </div>
  </template>
  
  <script>
  import Navbar from '@/components/Home/Navbar.vue';
  export default {
    name: 'Home',
    components: {
    Navbar
  }
  };
  </script>
  
  <style scoped>
  .jumbotron {
    padding: 4rem 2rem;
  }
  </style>
  