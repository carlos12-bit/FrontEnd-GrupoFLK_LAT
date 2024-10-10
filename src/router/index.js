import { createRouter, createWebHistory } from 'vue-router';

// Importar componentes
import Home from '@/views/Website/Home.vue';
import Login from '@/views/Security/Login.vue';
import Register from '@/views/Security/Register.vue';
import AdminDashboard from '@/views/Dashboards/Admin/Dashboard.vue';
import ReceptionistDashboard from '@/views/Dashboards/receptionist/Dashboard.vue';
import OperationsAssistantDashboard from '@/views/Dashboards/Op.Asist/Dashboard.vue';
import ManageRequest from '/workspaces/FrontEnd-GrupoFLK_LAT/src/views/UseCases/Admin/ManageRequest/View.vue';
import Services from '@/views/Website/Services.vue';
import About from '@/views/Website/About.vue';
import Contact from '@/views/Website/Contact.vue';
import ManagementServices from '@/views/UseCases/Admin/ManagementServices/View.vue';
import View from '/workspaces/FrontEnd-GrupoFLK_LAT/src/views/UseCases/Admin/ManageCourses/View.vue'; // Nueva importación
import Details from '/workspaces/FrontEnd-GrupoFLK_LAT/src/components/ManageRequest/Details.vue';
import CreateCourse from '/workspaces/FrontEnd-GrupoFLK_LAT/src/components/ManageCourses/Create.vue'; // Nueva importación

// Definir las rutas
const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/services', component: Services },
  { path: '/about', component: About },
  { path: '/contact', component: Contact },

  // Rutas que requieren rol de Administrador
  {
    path: '/admin-dashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, role: 'Administrador' },
  },
  {
    path: '/ManagementServices',
    component: ManagementServices,
    meta: { requiresAuth: true, role: 'Administrador' },
  },
  {
    path: '/manage-requests',
    component: ManageRequest,
  },
  {
    path: '/manage-courses',
    component: View,
  },
  {
    path: '/create-course',
    name: 'CreateCourse',  // Nombre de la ruta para el formulario de creación de cursos
    component: CreateCourse,
  },
  
  {
    path: '/details/:id',  // Ruta para mostrar los detalles de una solicitud
    name: 'Details',  // Nombre de la ruta que estás usando
    component: Details,
  },  

  // Requiere Rol de Recepcionista
  {
    path: '/receptionist-dashboard',
    component: ReceptionistDashboard,
    meta: { requiresAuth: true, role: 'Recepcionista' },
  },
  
  // Requiere Rol de Asistente de Operaciones
  {
    path: '/operations-assistant-dashboard',
    component: OperationsAssistantDashboard,
    meta: { requiresAuth: true, role: 'Asistente de Operaciones' },
  },
];

// Crear el router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard para proteger rutas según autenticación y rol
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user')); // Obtener el perfil del usuario de localStorage

  // Si la ruta requiere autenticación
  if (to.meta.requiresAuth) {
    if (!user) {
      console.warn("Ruta protegida. Redirigiendo a login.");
      return next({ path: '/login' }); // Redirige a login si no hay sesión
    }

    console.log("Usuario autenticado:", user);

    // Verificar el rol del usuario
    if (to.meta.role && to.meta.role !== user.rol) {
      console.warn(`Acceso denegado. Se requiere rol ${to.meta.role}, pero el usuario tiene rol ${user.rol}.`);
      return next({ path: '/' }); // Redirigir a la página de inicio si el rol no coincide
    }
  }

  // Si todo está bien, permitir el acceso
  next();
});

export default router;


