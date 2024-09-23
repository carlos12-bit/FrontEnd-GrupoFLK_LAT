import { createRouter, createWebHistory } from 'vue-router';

// Importar componentes
import Home from '@/views/Home.vue';
import Login from '@/views/Security/Login.vue';
import Register from '@/views/Security/Register.vue';
// Importar Daashboards
import AdminDashboard from '@/views/Dashboards/Admin/Dashboard.vue';
import RecepcionistDashboard from '@/views/Dashboards/receptionist/Dashboard.vue';
import OperationsAssistantDashboard from '@/views/Dashboards/Op.Asist/Dashboard.vue';

//Importar Funciones de Gestion
import ManageInspectionTypes from '@/views/ManageInspectionTypes.vue';
import Services from '@/views/Website/Services.vue';
import About from '@/views/Website/About.vue';
import Contact from '@/views/Website/Contact.vue';


// Definir las rutas
const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/services', component: Services },
  { path: '/about', component: About },
  { path: '/contact', component: Contact },
  
  
  //Requiere Rol de Administrador
  {
    path: '/admin-dashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, role: 'Administrador' }, // Protegida por autenticación y rol
  },
  {
    path: '/ManageInspectionTypes',
    component: ManageInspectionTypes,
    meta: { requiresAuth: true, role: 'Recepcionista' }, // Protegida por autenticación y rol
  },

  //Requiere Rol de Recepcionista
  {
    path: '/receptionist-dashboard',
    component: RecepcionistDashboard,
    meta: { requiresAuth: true, role: 'Recepcionista' }, // Protegida por autenticación y rol
  },
  //Requiere Rol de Asistente de Operaciones
  {
    path: '/operations-assistant-dashboard',
    component: OperationsAssistantDashboard,
    meta: { requiresAuth: true, role: 'Asistente de Operaciones' }, // Protegida por autenticación y rol
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
