<template>
    <div class="home">
      <div class="jumbotron text-center" style="background-color: #8C3A1C; color: white;">
        <h1 class="display-4">Inspección de Maquinaria Pesada</h1>
        <p class="lead">Ofrecemos servicios de inspección para montacargas, grúas y más.</p>
        <hr class="my-4" style="border-color: #BF5630;">
        <router-link to="/services" class="btn btn-primary btn-lg">Nuestros Servicios</router-link>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Home'
  };
  </script>
  
  <style scoped>
  .jumbotron {
    padding: 4rem 2rem;
  }
  </style>
  