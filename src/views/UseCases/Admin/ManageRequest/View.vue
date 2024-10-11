<template>
    <div class="main-content">
      <div class="container">
        <table class="solicitudes-table">
          <thead>
            <tr>
              <th>Solicitudes</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="solicitud in solicitudes" :key="solicitud.id_solicitud">
              <td>{{ solicitud.curso_solicitado || 'Sin curso' }}</td>
              <td>{{ solicitud.fecha_solicitud ? new Date(solicitud.fecha_solicitud).toLocaleDateString() : 'Sin fecha' }}</td>
              <td>
                <span :class="getEstadoClase(solicitud.estado)">
                  {{ solicitud.estado || 'Sin estado' }}
                </span>
              </td>
              <td>
                <button @click="verDetalles(solicitud.id_solicitud)" class="btn-ver">Ver</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
</template>

<script>
import { supabase } from '@/supabase.js';

export default {
  name: "GestionarSolicitudes",
  data() {
    return {
      solicitudes: []  // Array para almacenar las solicitudes
    };
  },
  async mounted() {
    // Obtenemos las solicitudes desde Supabase cuando el componente se monta
    let { data: solicitudes, error } = await supabase
      .from('Solicitud_Capacitacion')
      .select('*');

    if (error) {
      console.error("Error fetching data: ", error);
    } else {
      this.solicitudes = solicitudes;  // Asignamos las solicitudes al array
    }
  },
  methods: {
    // Redirigimos a la vista de detalles
    verDetalles(idSolicitud) {
      this.$router.push({ name: 'Details', params: { id: idSolicitud } });
    },
    // Devuelve una clase CSS según el estado de la solicitud
    getEstadoClase(estado) {
      if (estado === 'Aceptada') {
        return 'estado-aceptada';
      } else if (estado === 'Rechazada') {
        return 'estado-rechazada';
      } else {
        return 'estado-pendiente';
      }
    },
    async logout() {
      await supabase.auth.signOut();
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
/* Estructura del layout */
.dashboard-layout {
  display: flex;
  height: 100vh;
}

/* Sidebar */
.sidebar {
  width: 250px;
  height: 100vh;
  background-color: #333;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  position: fixed;
}

.logo {
  margin-bottom: 40px;
}

.logo h2 {
  color: #fff;
  font-size: 24px;
}

nav ul {
  list-style: none;
  padding: 0;
  width: 100%;
}

nav ul li {
  width: 100%;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  color: #fff;
  text-decoration: none;
  font-size: 16px;
  transition: background-color 0.3s;
}

.nav-link i {
  margin-right: 10px;
}

.nav-link:hover {
  background-color: #444;
}

/* Enlace activo */
.active-link {
  background-color: #1ABC9C; /* Color para el enlace activo */
}

.logout-btn {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  text-align: left;
  width: 100%;
  padding: 15px 20px;
  font-size: 16px;
  transition: background-color 0.3s;
}

.logout-btn:hover {
  background-color: #444;
}

/* Main content */
.main-content {
  margin-left: 250px;
  width: calc(100% - 250px);
  padding: 20px;
}

/* Tabla de solicitudes */
.solicitudes-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #f9f9f9;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.solicitudes-table th, .solicitudes-table td {
  padding: 1rem;
  text-align: center;
  border-bottom: 1px solid #ddd;
}

.solicitudes-table th {
  background-color: #f2f2f2;
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

.solicitudes-table td {
  font-size: 1rem;
}
.btn-ver {
  background-color: #2ecc71;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-ver:hover {
  background-color: #27ae60;
}

/* Estilos de estado */
.estado-aceptada {
  background-color: #2ecc71;
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 5px;
  font-size: 0.9rem;
}

.estado-rechazada {
  background-color: #e74c3c;
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 5px;
  font-size: 0.9rem;
}

.estado-pendiente {
  background-color: #f39c12;
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 5px;
  font-size: 0.9rem;
}
</style>
