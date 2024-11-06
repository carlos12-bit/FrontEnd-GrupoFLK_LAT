<template>
   <div class="jumbotron text-center">
    <div class="overlay"></div>
    <h1 class="display-4">Servicios de calidad</h1>
    <p class="lead">Ofrecemos servicios de inspección, capacitación y certificación.</p>
    <hr class="my-4" style="border-color: #BF5630;">
    
    <div class="button-group">
      <router-link to="/services" class="btn btn-yellow btn-lg">Nuestros Servicios</router-link>
      <a href="https://wa.me/51966401791?text=Hola%2C%20Quisiera%20solicitar%20Informes" target="_blank" class="btn btn-whatsapp">
        <i class="fab fa-whatsapp"></i> Contáctanos por WhatsApp
      </a>
      <router-link to="/RequestTraining" class="btn btn-read btn-lg">Solicitar Capacitación</router-link>
    </div>
    
    <hr class="my-4" style="border-color: #FF8C42;">
  </div>
</template>

<script>
export default {
  name: 'Jumbotron'
};
</script>

<style scoped>
.button-group {
  display: flex;
  justify-content: center;
  gap: 10px; /* Ajusta el valor para acercar o separar los botones */
  flex-wrap: wrap; /* Permite que los botones se ajusten en pantallas pequeñas */
}

.btn-read, .btn-yellow, .btn-whatsapp {
  margin-top: 0; /* Elimina el margen superior para que los botones estén alineados */
}
.jumbotron {
  position: relative;
  background-image: url('/src/assets/Portada.png'); /* Reemplaza con la ruta correcta de tu imagen */
  background-size: cover;
  background-position: center;
  color: white;
  padding: 4rem 2rem;
  margin-bottom: 0; /* Elimina cualquier margen adicional que no sea necesario */
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Fondo oscuro semitransparente */
  z-index: 1;
}

.jumbotron h1, 
.jumbotron p, 
.jumbotron .btn {
  position: relative;
  z-index: 2;
  margin-bottom: 1rem;
}
/* Botón rojo para "Solicitar Capacitacion" */

.btn-read {
  background-color: #FF8C42;
  color: white;
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  display: inline-block;
  gap: 30px;
  transition: background-color 0.3s ease;
}

.btn-read:hover {
  background-color: #e67e34;
  color: white;
}
/* Botón amarillo para "Nuestros Servicios" */
.btn-yellow {
  background-color: #FFC107;
  color: white;
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  display: inline-block;
  transition: background-color 0.3s ease;
}

.btn-yellow:hover {
  background-color: #e6ac00;
  color: white;
}

/* Botón verde para WhatsApp */
.btn-whatsapp {
  background-color: #25d366;
  color: white;
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  display: inline-flex;
  align-items: center;
  font-size: 1.25rem;
  transition: background-color 0.3s ease;
}

.btn-whatsapp:hover {
  background-color: #1ebe57;
}

.btn-whatsapp i {
  margin-right: 0.5rem;
  font-size: 1.5rem;
}

/* Ajustes para pantallas más pequeñas */
@media (max-width: 768px) {
  .jumbotron {
    padding: 2rem 1rem;
  }

  .jumbotron h1 {
    font-size: 2rem;
  }

  .btn-yellow, 
  .btn-whatsapp {
    padding: 0.5rem 1rem;
    font-size: 1rem;
  }

  .btn-whatsapp i {
    font-size: 1.25rem;
  }
}
</style>