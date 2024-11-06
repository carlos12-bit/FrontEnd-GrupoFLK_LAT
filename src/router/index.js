import { createRouter, createWebHistory } from 'vue-router';
import { getSession, buscarRol } from '../auth'; // Importar funciones de autenticación

// Importar componentes y layouts
import Home from '@/views/Website/Home.vue';
import Login from '@/views/Security/Login.vue';
import Register from '@/views/Security/Register.vue';
import Services from '@/views/Website/Services.vue';
import RequestTraining from '@/views/Website/RequestTraining.vue'
import AdminLayout from '@/views/Layout/Admin/AdminLayout.vue';
import ReceptionistLayout from '@/views/Layout/Receptionist/ReceptionistLayout.vue';
import OperationsAssistantLayout from '@/views/Layout/Op.Asist/OperationsAssistantLayout.vue';
import OperatorLayout from '@/views/Layout/Operator/OperatorLayout.vue';
import ManagementServices from '@/views/UseCases/Admin/ManagementServices/View.vue';
import MangementPersonal from '../views/UseCases/Admin/GestionarPersonal/View.vue';
import ManageRequest from '@/views/UseCases/Admin/ManageRequest/ManageRequest.vue';
import ManageCourses from '@/views/UseCases/Admin/ManageCourses/View.vue';
import CourseMaterials from '/workspaces/FrontEnd-GrupoFLK_LAT/src/views/UseCases/Operator/CourseMaterials/view.vue';
import AccessDenied from '@/views/Security/AccessDenied.vue'; // Asegúrate de tener este componente importado

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/services', component: Services }, // corregido 'Services'
  { path: '/RequestTraining', component: RequestTraining },
 
 
  // Rutas del dashboard de administrador con layout persistente
  {
    path: '/admin-dashboard',
    component: AdminLayout, // El layout principal del administrador que siempre se muestra
    meta: { requiresAuth: true, role: 'Administrador' },
    children: [
      {
        path: 'home',
        component: AccessDenied, // Vista de inicio del dashboard
      },
      {
        path: 'ManagementServices',
        component: ManagementServices, // Vista de gestión de servicios
      },
      {
        path: 'MangementPersonal',
        component: MangementPersonal, // Vista de gestión de personal
      },
      {
        path: 'manage-request',
        component: ManageRequest, // Vista de gestión de solicitudes
      },
      {
        path: 'ManageCourses',
        component: ManageCourses, // Vista de gestión de cursos
      },
    ],
  },

  // Rutas para otros roles (Recepcionista y Asistente de Operaciones)
  {
    path: '/receptionist-dashboard',
    component: ReceptionistLayout,
    meta: { requiresAuth: true, role: 'Recepcionista' },
    children: [
      {
        path: 'home',
        component: AccessDenied, // Vista de inicio del dashboard
      },
    ],
  },

  {
    path: '/operations-assistant-dashboard',
    component: OperationsAssistantLayout,
    meta: { requiresAuth: true, role: 'Asistente de Operaciones' },
    children: [
      {
        path: 'home',
        component: AccessDenied, // Vista de inicio del dashboard
      },
    ],
  },

  {
    path: '/operator-dashboard',
    component: OperatorLayout,
    meta: { requiresAuth: true, role: 'Operador' },
    children: [
      {
        path: 'home',
        component: AccessDenied, // Vista de inicio del dashboard
      },
      {
        path: 'CourseMaterials',
        component: CourseMaterials, // Vista de inicio del dashboard
      },
   
    ],
  },
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