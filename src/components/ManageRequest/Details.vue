<template>
  <div class="dashboard-layout">
    <!-- Sidebar -->
    <div class="sidebar">
      <div class="logo">
        <h2>Mi Dashboard</h2>
      </div>
      <nav>
        <ul>
          <li>
            <router-link to="/dashboard" class="nav-link">
              <i class="fas fa-home"></i> Inicio
            </router-link>
          </li>
          <li>
            <router-link to="/profile" class="nav-link">
              <i class="fas fa-user"></i> Perfil
            </router-link>
          </li>
          <li>
            <router-link to="/settings" class="nav-link">
              <i class="fas fa-cog"></i> Configuración
            </router-link>
          </li>
          <li>
            <router-link to="/reports" class="nav-link">
              <i class="fas fa-chart-bar"></i> Reportes
            </router-link>
          </li>
          <li>
            <router-link to="/manage-requests" class="nav-link">
              <i class="fas fa-tasks"></i> Gestionar Solicitudes
            </router-link>
          </li>
          <li>
            <router-link to="/manage-courses" class="nav-link">
              <i class="fas fa-book"></i> Gestionar Cursos
            </router-link>
          </li>
          <li>
            <button @click="logout" class="nav-link logout-btn">
              <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
            </button>
          </li>
        </ul>
      </nav>
    </div>

    <!-- Contenido principal -->
    <div class="main-content">
      <navbar></navbar>
      <div class="container">
        <h1 class="page-title">Detalles de la Solicitud</h1>
        <div v-if="solicitud" class="detalle-solicitud">
          <p><strong>Nombre Completo:</strong> {{ solicitud.nombre_completo }}</p>
          <p><strong>DNI:</strong> {{ solicitud.dni }}</p>
          <p><strong>Fecha de Solicitud:</strong> {{ new Date(solicitud.fecha_solicitud).toLocaleDateString() }}</p>
          <p><strong>Curso Solicitado:</strong> {{ solicitud.curso_solicitado }}</p>
          <p><strong>Número Telefónico:</strong> {{ solicitud.nro_telefonico }}</p>
          <p><strong>Dirección:</strong> {{ solicitud.direccion }}</p>
          <p><strong>Correo Electrónico:</strong> {{ solicitud.correo_electronico }}</p>
          <p><strong>Nacionalidad:</strong> {{ solicitud.nacionalidad }}</p>
          
          <!-- Mostrar imágenes adjuntas si existen -->
          <div v-if="solicitud.dni_adjunto">
            <p><strong>DNI Adjunto:</strong></p>
            <img :src="solicitud.dni_adjunto" alt="DNI Adjunto" class="imagen-adjunta" />
          </div>
          
          <div v-if="solicitud.certificado_medico_adjunto">
            <p><strong>Certificado Médico Adjunto:</strong></p>
            <img :src="solicitud.certificado_medico_adjunto" alt="Certificado Médico Adjunto" class="imagen-adjunta" />
          </div>

          <div v-if="solicitud.licencia_conducir_adjunto">
            <p><strong>Licencia de Conducir Adjunto:</strong></p>
            <img :src="solicitud.licencia_conducir_adjunto" alt="Licencia de Conducir Adjunto" class="imagen-adjunta" />
          </div>

          <!-- Botones de Aceptar y Rechazar -->
          <button @click="gestionarSolicitud('aceptar')" class="card-btn">Aceptar</button>
          <button @click="abrirModalRechazo" class="card-btn card-btn-rechazar">Rechazar</button>
        </div>

        <!-- Modal para Motivo de Rechazo -->
        <div v-if="mostrarModalRechazo" class="modal">
          <div class="modal-content">
            <h3>Motivo de Rechazo</h3>
            <textarea v-model="motivoRechazo" placeholder="Ingrese el motivo del rechazo"></textarea>
            <div class="modal-buttons">
              <button @click="gestionarSolicitud('rechazar')" class="card-btn">Confirmar Rechazo</button>
              <button @click="cerrarModalRechazo" class="card-btn card-btn-rechazar">Cancelar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from '@/supabase.js';

export default {
  name: "DetallesSolicitud",
  data() {
    return {
      solicitud: null,
      mostrarModalRechazo: false,
      motivoRechazo: "" // Para almacenar el motivo del rechazo
    };
  },
  async mounted() {
    // Obtenemos los detalles de la solicitud seleccionada usando el id pasado por params
    let { data: solicitud, error } = await supabase
      .from('Solicitud_Capacitacion')
      .select('*')
      .eq('id_solicitud', this.$route.params.id)
      .single();

    if (error) {
      console.error("Error fetching data: ", error);
    } else {
      this.solicitud = solicitud;
    }
  },
  methods: {
    abrirModalRechazo() {
      this.mostrarModalRechazo = true;
    },
    cerrarModalRechazo() {
      this.mostrarModalRechazo = false;
    },
    async gestionarSolicitud(accion) {
      let nuevoEstado = accion === 'aceptar' ? 'Aceptada' : 'Rechazada';
      
      if (accion === 'rechazar' && !this.motivoRechazo) {
        alert("Por favor, ingrese el motivo del rechazo.");
        return;
      }

      try {
        const { error } = await supabase
          .from('Solicitud_Capacitacion')
          .update({ 
            estado: nuevoEstado,
            motivo_rechazo: this.motivoRechazo // Guardar el motivo de rechazo en la base de datos
          })
          .eq('id_solicitud', this.$route.params.id);

        if (error) {
          throw error;
        }

        alert(`La solicitud ha sido ${nuevoEstado}`);
        
        // Redirigir al componente ManageRequest después de la acción
        this.$router.push({ path: '/manage-requests' });

      } catch (error) {
        console.error(`Error al ${accion} la solicitud: `, error);
        alert(`Ocurrió un error al ${accion} la solicitud`);
      } finally {
        this.cerrarModalRechazo();
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

.logo h2 {
  color: #fff;
  font-size: 24px;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  color: #fff;
  text-decoration: none;
  font-size: 16px;
  width: 100%;
}

.nav-link i {
  margin-right: 10px;
}

.nav-link:hover {
  background-color: #444;
}

.logout-btn {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 15px 20px;
  text-align: left;
  width: 100%;
}

.main-content {
  margin-left: 250px;
  padding: 2rem;
  width: calc(100% - 250px);
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f4f4f9;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.detalle-solicitud {
  font-size: 1.2rem;
  line-height: 2;
  color: black;
}

.page-title {
  color: black;
  text-align: center;
}

.imagen-adjunta {
  max-width: 300px;
  margin-bottom: 20px;
}

.card-btn {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #1A5276;
  color: white;
  border-radius: 5px;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.card-btn:hover {
  background-color: #2980B9;
}

.card-btn-rechazar {
  background-color: #C0392B;
}

.card-btn-rechazar:hover {
  background-color: #E74C3C;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  max-width: 500px;
  width: 100%;
  text-align: center;
}

.modal-content textarea {
  width: 100%;
  height: 100px;
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #ddd;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
}
</style>
