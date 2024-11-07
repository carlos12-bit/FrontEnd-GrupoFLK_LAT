<template>
  <!-- Menú lateral (drawer) con diseño profesional -->
  <el-menu
    v-if="!isMobile || !isCollapse"
    default-active="1-1"
    class="el-menu-vertical-demo"
    :collapse="isCollapse"
    @open="handleOpen"
    @close="handleClose"
  >
    <div class="logo">
      <img src="@/assets/SELLO_FLK.png" alt="Logo" />
    </div>

    <!-- Submenú Gestión General -->
    <el-sub-menu index="1">
      <template #title>
        <el-icon><icon-menu /></el-icon>
        <span>CURSOS</span>
      </template>
     
        <!-- Subgrupo de Gestión Operativa con opciones -->
        <el-menu-item index="1-1">
          <router-link class="nav-link" to="/operator-dashboard/ActivitiesCalendar">
            Calendario de Actividades
          </router-link>
        </el-menu-item>
        <el-menu-item index="1-2">
          <router-link class="nav-link" to="">
            Sesiones Programadas
          </router-link>
        </el-menu-item>
    </el-sub-menu>

    <!-- Submenú Gestión de Alumnos y Solicitudes -->
    <el-sub-menu index="2">
      <template #title>
        <el-icon><icon-menu /></el-icon>
        <span>EVALUACION </span>
      </template>
      <el-menu-item index="2-1">
        <router-link class="nav-link" to="">
          Calificaciones
        </router-link>
      </el-menu-item>
      <el-menu-item index="2-2">
        <router-link class="nav-link" to="">
          Informe de Desempeño
        </router-link>
      </el-menu-item>
    </el-sub-menu>
      <!-- Submenú Certificado -->
      <el-menu-item index="3" @click="handleLogout">
      <el-icon><icon-menu /></el-icon>
      <template #title>GESTION CERTIFICADO</template>
    </el-menu-item>
  
    <!-- Botón de Cerrar Sesión -->
    <el-menu-item index="4" @click="handleLogout">
      <el-icon><User /></el-icon>
      <template #title>CERRAR SESION</template>
    </el-menu-item>
  </el-menu>

  <!-- Botón de hamburguesa (solo visible en móviles) -->
  <button 
    v-if="isMobile" 
    class="hamburger-menu"
    @click="toggleCollapse"
    :class="{ 'active': isCollapse }"
  >
    <span class="bar"></span>
    <span class="bar"></span>
    <span class="bar"></span>
  </button>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { supabase } from '@/supabase';
import { useRouter } from 'vue-router';

// Importar íconos de Element Plus
import { Document, Menu as IconMenu, Location, Setting, User } from '@element-plus/icons-vue';

// Estado para controlar si el menú está colapsado o no
const isCollapse = ref(false)
// Estado para detectar si es móvil o no
const isMobile = ref(false)

// Obtener la funcionalidad del enrutador para redirigir al usuario
const router = useRouter()

// Función para cerrar sesión
const handleLogout = async () => {
  try {
    await supabase.auth.signOut()
    localStorage.removeItem('user') // Eliminar el usuario del almacenamiento local
    router.push('/login') // Redirigir al login después de cerrar sesión
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
  }
}

// Función para alternar el estado del menú
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

// Función para manejar la apertura del menú
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

// Función para manejar el cierre del menú
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

// Función para detectar si es móvil según el tamaño de la ventana
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

// Ejecutar la verificación al montar el componente y actualizar en cambios de tamaño de pantalla
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

// Limpiar el evento cuando el componente se desmonta
onBeforeUnmount(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
/* Drawer negro con diseño corporativo */
.el-menu-vertical-demo {
  background-color: #6c6c70a9; /* Negro elegante */
  color: #000000; /* Naranja corporativo */
  border-right: none;
  transition: all 0.3s ease-in-out;
  width: 200px;
  font-size: 18px; /* Aumento general del tamaño de la letra */
}

.el-menu-vertical-demo.el-menu--collapse {
  width: 64px;
  transition: all 0.3s ease-in-out;
}

/* Estilo de los ítems del menú */
.el-menu-item {
  color: #000000;
  transition: color 0.3s ease;
  font-size: relative; /* Ajuste del tamaño de fuente */
  font-weight: relative; /* Peso equilibrado */
  height: auto !important; /* Asegura que los ítems del menú ajusten su altura */
  overflow: visible; /* Permite que el contenido no se corte */
}

.el-menu-item.is-active {
  background-color: rgba(255, 165, 0, 0.1); /* Fondo suave cuando está activo */
  color: #000000;
}

.el-menu-item:hover {
  color: #000000; /* Un tono más oscuro de naranja en hover */
}

/* Submenús y títulos */
.el-sub-menu .el-menu-item-group__title, .el-sub-menu .el-sub-menu__title {
  color: #000000;
  transition: color 0.3s ease;
  font-size: 19px; /* Aumento de tamaño en los títulos */
  font-weight: 600; /* Títulos más destacados */
}

.el-sub-menu__title:hover {
  color: #000000;
}

/* Iconos dentro del menú (naranja corporativo) */
.el-menu-item .el-icon, .el-sub-menu .el-icon {
  color: #000000;
}

.el-menu-item.is-active .el-icon, .el-menu-item:hover .el-icon {
  color: #000000; /* Mismo cambio de color en hover para los iconos */
}

/* Estilo para los textos largos en el menú */
.menu-item-long-text {
  white-space: normal; /* Permite que el texto se ajuste en varias líneas */
  word-wrap: break-word; /* Ajusta el texto en palabras largas */
  max-width: 180px; /* Establece un ancho máximo para los ítems del menú */
  line-height: 1.5; /* Ajusta la altura de línea para mejor legibilidad */
  overflow-wrap: break-word; /* Fuerza el ajuste del texto cuando es necesario */
  padding: 10px 0; /* Aumenta el espacio vertical para evitar que el texto se vea comprimido */
}

/* Estilos del botón de hamburguesa */
.hamburger-menu {
  position: relative;
  top: 20px;
  left: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 35px;
  height: 30px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  z-index: 1001;
  transition: all 0.3s ease-in-out;
}

/* Barras del botón */
.hamburger-menu .bar {
  width: 100%;
  height: 4px;
  background-color: #ffa500;
  border-radius: 10px;
  transition: all 0.3s ease-in-out;
}

/* Cambios en el botón cuando el menú está activo */
.hamburger-menu.active .bar:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
  background-color: #000000;
}

.hamburger-menu.active .bar:nth-child(2) {
  opacity: 0;
}

.hamburger-menu.active .bar:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
  background-color: #000000;
}

/* Efecto hover para el botón */
.hamburger-menu:hover .bar {
  background-color: #e69500; /* Un cambio suave al pasar el mouse */
}
.logo img {
  position: relative;
  width: 100%;
  height: 100%;
  margin: 20px auto; /* Centra el logo horizontalmente */
  display: block; /* Asegura que la imagen se trate como un bloque */
}

</style>
