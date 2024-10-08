import { createRouter, createWebHistory } from 'vue-router';
import { getSession, buscarRol } from '../auth'; // Importar funciones de autenticación

// Importar componentes y layouts
import Home from '@/views/Website/Home.vue';
import Login from '@/views/Security/Login.vue';
import Register from '@/views/Security/Register.vue';
import AdminLayout from '../views/Dashboards/Admin/AdminLayout.vue'; // El layout fijo del dashboard de administrador
import AdminDashboard from '@/views/Dashboards/Admin/Dashboard.vue';
import ManagementServices from '../views/UseCases/Admin/ManagementServices/View.vue';
import ManagementtypeInspeccion from '../views/UseCases/Admin/ManagementTypesInspeccion/View.vue';
import ReceptionistDashboard from '@/views/Dashboards/Receptionist/Dashboard.vue';
import OperationsAssistantDashboard from '@/views/Dashboards/Op.Asist/Dashboard.vue';

// Definir las rutas
const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/register', component: Register },

  // Rutas del dashboard de administrador con layout persistente
  {
    path: '/admin-dashboard',
    component: AdminLayout, // El layout principal del administrador que siempre se muestra
    meta: { requiresAuth: true, role: 'Administrador' },
    children: [
      {
        path: 'home',
        component: AdminDashboard, // Vista de inicio del dashboard
      },
      {
        path: 'management-services',
        component: ManagementServices, // Vista de gestión de servicios
      },
      {
        path: 'management-inspections',
        component: ManagementtypeInspeccion, // Vista de gestión de inspecciones
      }
    ]
  },

  // Rutas para otros roles (Recepcionista y Asistente de Operaciones)
  { 
    path: '/receptionist-dashboard', 
    component: ReceptionistDashboard, 
    meta: { requiresAuth: true, role: 'Recepcionista' } 
  },
  { 
    path: '/operations-assistant-dashboard', 
    component: OperationsAssistantDashboard, 
    meta: { requiresAuth: true, role: 'Asistente de Operaciones' } 
  }
];

// Crear el router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard para proteger rutas según autenticación y rol
router.beforeEach(async (to, from, next) => {
  try {
    const session = await getSession(); // Obtener la sesión

    if (to.meta.requiresAuth) {
      if (!session) {
        return next('/login'); // Redirigir al login si no hay sesión
      }

      const user = session.user; // Obtener el usuario autenticado

      // Obtener el rol del usuario desde la base de datos (tabla AsignacionDeUsuario)
      const { rolId } = await buscarRol(user.id); // Consultar el rol del usuario

      // Verificar si el rol del usuario coincide con el requerido en la ruta
      if (to.meta.role && to.meta.role !== getNombreRol(rolId)) {
        return next('/'); // Redirigir a la página de inicio si el rol no coincide
      }
    }

    next(); // Permitir el acceso si todo está bien
  } catch (error) {
    console.error('Error al verificar la autenticación o rol:', error);
    return next('/login'); // Redirigir al login en caso de error
  }
});

// Función para obtener el nombre del rol basado en el ID del rol
function getNombreRol(rolId) {
  switch (rolId) {
    case 1:
      return 'Nuevo';
    case 2:
      return 'Asistente de Operaciones';
    case 3:
      return 'Administrador';
    case 4:
      return 'Recepcionista';
    case 5:
      return 'Operador';
    case 6:
      return 'Instructor';
    case 7:
      return 'Formador';
    default:
      return null;
  }
}

export default router;
