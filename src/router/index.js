import { createRouter, createWebHistory } from 'vue-router';
import { getSession, buscarRol } from '@/auth';

const routes = [
  { path: '/', component: () => import('@/views/Website/Home.vue') },
  { path: '/login', component: () => import('@/views/Security/Login.vue') },
  { path: '/register', component: () => import('@/views/Security/Register.vue') },
  { path: '/services', component: () => import('@/views/Website/Services.vue') },
  { path: '/resetpassword', component: () => import('@/views/Security/ResetPassword.vue') },

  {
    path: '/admin-dashboard',
    component: () => import('@/views/Layout/Admin/AdminLayout.vue'),
    meta: { requiresAuth: true, role: 'Administrador' },
    children: [
      { path: 'home', component: () => import('@/views/Security/AccessDenied.vue') },
      { path: 'GestionarServicios', component: () => import('@/views/UseCases/Admin/GestionarServicios/view.vue') },
      { path: 'GestionarPersonal', component: () => import('@/views/UseCases/Admin/GestionarPersonal/view.vue') },
      { path: 'ManageRequest', component: () => import('@/views/UseCases/Admin/ManageRequest/ManageRequest.vue') },
      { path: 'ManageCourses', component: () => import('@/views/UseCases/Admin/ManageCourses/View.vue') },
      { path: 'details/:id', name: 'Details', component: () => import('@/components/ManageRequest/Details.vue') },
      { path: 'ManageCredentials', component: () => import('@/views/UseCases/Admin/ManageCredentials/ManageCredentials.vue') },
      { path: 'ScheduleTraining', component: () => import('@/components/ManageRequest/ScheduleTraining.vue') },
    ],
  },

  {
    path: '/receptionist-dashboard',
    component: () => import('../views/Layout/Receptionist/ReceptionistLayout.vue'),
    meta: { requiresAuth: true, role: 'Recepcionista' },
    children: [
      { path: 'home', component: () => import('@/views/Security/AccessDenied.vue') },
      { path: 'InspeccionesProgramadas', component: () => import('@/views/UseCases/Recepcionist/InspeccionesProgramadas/view.vue') },
      { path: 'RegisterInstructor', component: () => import('@/views/UseCases/Recepcionist/ManageUsers/RegisterInstructor/View.vue') },
      { path: 'RegisterOperator', component: () => import('@/views/UseCases/Recepcionist/ManageUsers/RegisterOperator/View.vue') },
      { path: 'RegisterTrainer', component: () => import('@/views/UseCases/Recepcionist/ManageUsers/RegisterTrainer/View.vue') },
      { path: 'ManageRequest', component: () => import('../views/UseCases/Recepcionist/ManageTraining/ManageRequest/ManageRequest.vue') },
      { path: 'ScheduleTraining', component: () => import('../components/ManageRequest/ScheduleTraining.vue') },
      { path: 'details/:id', name: 'Details', component: () => import('@/components/ManageRequest/Details.vue') },
      { path: 'RegisterOperador1', component: () => import('../components/UserList/RegistrarOperador1.vue') },
    ],
  },

  {
    path: '/operations-assistant-dashboard',
    component: () => import('@/views/Layout/Op.Asist/OperationsAssistantLayout.vue'),
    meta: { requiresAuth: true, role: 'Asistente de Operaciones' },
    children: [
      { path: 'home', component: () => import('@/views/Security/AccessDenied.vue') },
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
    const session = await getSession();

    if (to.meta.requiresAuth) {
      if (!session) return next('/login');

      const user = session.user;
      const { rolId } = await buscarRol(user.id);

      if (to.meta.role && to.meta.role !== getNombreRol(rolId)) {
        return next('/');
      }
    }
    next();
  } catch (error) {
    console.error('Error al verificar la autenticación o rol:', error);
    return next('/login');
  }
});

// Función para obtener el nombre del rol basado en el ID del rol
function getNombreRol(rolId) {
  switch (rolId) {
    case 1: return 'Nuevo';
    case 2: return 'Asistente de Operaciones';
    case 3: return 'Administrador';
    case 4: return 'Recepcionista';
    case 5: return 'Operador';
    case 6: return 'Instructor';
    case 7: return 'Formador';
    default: return null;
  }
}

export default router;