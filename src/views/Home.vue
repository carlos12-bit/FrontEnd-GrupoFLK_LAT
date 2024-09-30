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


    <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-indicators">
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
      </div>
      <div class="carousel-inner">
        <div class="carousel-item active">
          <img src="https://grupoflk.com/wp-content/uploads/2023/06/portada-1221.png" class="d-block w-100 carousel-image" alt="...">
        </div>
        <div class="carousel-item">
          <img src="https://grupoflk.com/wp-content/uploads/2023/06/portada-122211.png" class="d-block w-100 carousel-image" alt="...">
        </div>
        <div class="carousel-item">
          <img src="https://grupoflk.com/wp-content/uploads/2023/06/portada-1.png" class="d-block w-100 carousel-image" alt="...">
        </div>
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>

    <div class="certifications-section text-center">
    <div class="certification-logos">
      <img src="https://grupoflk.com/wp-content/uploads/2023/06/NACB-blanco-300x109.png" alt="NACB Logo" class="cert-logo">
      <img src="https://grupoflk.com/wp-content/uploads/2023/06/Iso14001-150x150.png" alt="ISO 14001 Logo" class="cert-logo">
      <img src="https://grupoflk.com/wp-content/uploads/2023/06/iso-blanco-150x150.png" alt="ISO 9001 Logo" class="cert-logo">
      <img src="https://grupoflk.com/wp-content/uploads/2023/06/asme-blanco.png" alt="ASME Logo" class="cert-logo">
      <img src="https://grupoflk.com/wp-content/uploads/2023/06/ansi-blanco.png" alt="ANSI Logo" class="cert-logo">
    </div>
  </div>

  <div class="why-choose-us">
  <h2>¿Por qué elegirnos?</h2>
  <div class="reasons-grid">
    <div class="reason">
      <h3>Experiencia</h3>
      <p>Contamos con una amplia trayectoria en la formación, certificación y homologación de operadores, garantizando el cumplimiento de normativas internacionales.</p>
    </div>
    <div class="reason">
      <h3>Calidad</h3>
      <p>Nuestro compromiso es propiciar la mejora continua en la capacitación y seguridad de los operadores, apoyándonos en procesos eficientes y control de riesgos.</p>
    </div>
    <div class="reason">
      <h3>Puntualidad</h3>
      <p>Somos la única empresa que desarrolla cursos fuera del Perú, certificando a más del 50% de empresas logísticas en el país.</p>
    </div>
    <div class="reason">
      <h3>Pasión</h3>
      <p>Asesoramos a clientes de industrias clave como minería, energía, y construcción, siempre con un enfoque personalizado y compromiso hacia la excelencia.</p>
    </div>
  </div>
</div>

<section class="image-container">
  <img src="https://grupoflk.com/wp-content/uploads/2023/06/Acreditacion.png" alt="Acreditación Internacional" class="responsive-image">
</section>

<section class="contact-form">
  <h2>Contáctanos</h2>
  <form action="#" method="post">
    <div class="form-group">
      <label for="razon-social">Razón social *</label>
      <input type="text" id="razon-social" name="razon-social" required>
    </div>
    <div class="form-group">
      <label for="info">¿Qué información desea?</label>
      <select id="info" name="info">
        <option value="Cursos de Operadores">Cursos de Operadores</option>
        <option value="Servicios de Inspección">Servicios de Inspección</option>
        <option value="Consultoría">Servicio de Consultoría</option>
      </select>
    </div>
    <div class="form-group">
      <label for="numero">Número de contacto *</label>
      <input type="tel" id="numero" name="numero" required>
    </div>
    <div class="form-group">
      <label for="correo">Correo electrónico *</label>
      <input type="email" id="correo" name="correo" required>
    </div>
    <div class="form-group">
      <label for="lugar">Lugar de Servicios</label>
      <select id="lugar" name="lugar">
        <option value="Lima">Lima</option>
        <option value="Arequipa">Arequipa</option>
        <option value="Cajamarca">Cajamarca</option>
      </select>
    </div>
    <div class="form-group">
      <label>Experiencia</label>
      <div class="radio-group">
        <input type="radio" id="con-experiencia" name="experiencia" value="Con Experiencia" checked>
        <label for="con-experiencia">Con Experiencia</label>
        <input type="radio" id="sin-experiencia" name="experiencia" value="Sin Experiencia">
        <label for="sin-experiencia">Sin Experiencia</label>
      </div>
    </div>
    <div class="form-group">
      <label for="comentario">Comentario</label>
      <textarea id="comentario" name="comentario" rows="4"></textarea>
    </div>
    <button type="submit">Enviar</button>
  </form>
</section>

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
  .carousel-image {
  height: 500px; 
  object-fit: cover; 
  width: 100%;
}

.carousel-inner {
  max-height: 500px; 
}
.carousel-image {
  height: 500px;
  object-fit: cover;
  width: 100%;
}

/* Nueva sección para los logotipos */
.certifications-section {
  background-color: #262624; /* Un fondo claro para resaltar los logotipos */
  padding: 2rem 0;
}

.certification-logos {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem; /* Espacio entre los logotipos */
  flex-wrap: wrap; /* Permitir que los logotipos se ajusten en filas si es necesario */
}

.cert-logo {
  max-width: 150px; /* Tamaño máximo de los logotipos */
  height: auto; /* Mantener la proporción de los logotipos */
  opacity: 0.8; 
  transition: opacity 0.3s ease;
}

.cert-logo:hover {
  opacity: 1; 
}
.why-choose-us {
  background-color: #f8f9fa;
  padding: 3rem 1rem;
  text-align: center;
}

.why-choose-us h2 {
  color: #BF391B; /* Color de título */
  margin-bottom: 2rem;
}

.reasons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.reason {
  background-color: white;
  border: 1px solid #ddd;
  padding: 1.5rem;
  border-radius: 5px;
}

.reason h3 {
  color: #F2913D; /* Color de subtítulos */
  margin-bottom: 1rem;
}

.reason p {
  color: #515459;
}
.image-container {
  display: flex;
  justify-content: center; /* Centra la imagen horizontalmente */
  align-items: center; /* Centra la imagen verticalmente si es necesario */
  padding: 2rem;
  background-color: #f8f9fa; /* Un color de fondo claro */
  border: 2px solid #F2B950; /* Borde dorado */
  border-radius: 10px; /* Bordes redondeados */
  max-width: 100%; /* Ajusta a un ancho máximo del contenedor */
  margin: 2rem auto; /* Centra el contenedor */
}

.responsive-image {
  max-width: 100%;
  height: auto;
  border-radius: 5px; /* Bordes ligeramente redondeados para la imagen */
}
.contact-form {
  background-color: #F2913D;
  padding: 2rem;
  border-radius: 10px;
  max-width: 600px;
  margin: 2rem auto;
}

.contact-form h2 {
  text-align: center;
  color: #BF391B;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-group input, 
.form-group select, 
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.radio-group {
  display: flex;
  gap: 1rem;
}

.radio-group label {
  font-weight: normal;
}

.contact-form button {
  display: block;
  width: 100%;
  padding: 1rem;
  background-color: #BF391B;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
}

.contact-form button:hover {
  background-color: #F26430;
}

  </style>
  