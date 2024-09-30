<template>
<navbar>    
</navbar>
<h1 class="page-title">Servicios Inspecciones</h1>
<div class="card-group" id="inspeccion-cards"></div>
</template>

<script>
import navbar from '@/components/Home/Navbar.vue';
import { supabase } from '@/supabase.js';

export default {
    name: "Services",
  components: { navbar },
    async mounted() {
      let { data: tipo_de_inspeccion, error } = await supabase
        .from('tipo_de_inspeccion')
        .select('*');
      
      if (error) {
        console.error("Error fetching data: ", error);
      } else {
        this.renderCards(tipo_de_inspeccion); // Llama a la función para renderizar las tarjetas
      }
    },
    methods: {
      renderCards(tipo_de_inspeccion) {
        const cardContainer = document.getElementById('inspeccion-cards');
        tipo_de_inspeccion.forEach((inspeccion) => {
          const card = `
            <div class="card">
              <img class="card-img-top" src="${inspeccion.Foto_Referencial || 'default-image-url.jpg'}" alt="${inspeccion.nombre || 'Nombre no disponible'}">
              <div class="card-body">
                <h5 class="card-title">${inspeccion.nombre || 'Nombre no disponible'}</h5>
                <p class="card-text">${inspeccion.descripcion || 'Descripción no disponible'}</p>
                <p class="card-text"><small class="text-muted">Última actualización: ${inspeccion.fecha_de_modificacion ? new Date(inspeccion.fecha_de_modificacion).toLocaleDateString() : 'Fecha no disponible'}</small></p>
              </div>
            </div>
          `;
          cardContainer.innerHTML += card;
        });
      }
    }
  };

</script>
<style>
/* Contenedor general */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f4f4f9;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* Título */
.page-title {
  text-align: center;
  font-size: 2.5rem;
  color: #BF391B;
  margin-bottom: 2rem;
  font-weight: bold;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
}

/* Diseño del grupo de tarjetas */
.card-group {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 2rem;
}

/* Tarjeta individual */
.card {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 10px;
  width: 250px;
  transition: transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  overflow: hidden;
}

.card:hover {
  transform: translateY(-10px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

/* Imagen de la tarjeta */
.card-img-top {
  width: 100%;
  height: 150px;
  object-fit: contain;
  background-color: #f9f9f9;
  padding: 10px;
}

/* Cuerpo de la tarjeta */
.card-body {
  padding: 1.5rem;
  text-align: center;
}

/* Título de la tarjeta */
.card-title {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 0.5rem;
}

/* Texto de la tarjeta */
.card-text {
  font-size: 1rem;
  color: #555;
}

/* Botón de la tarjeta */
.card-btn {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #BF391B;
  color: white;
  border-radius: 5px;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.card-btn:hover {
  background-color: #F26430;
}
</style>