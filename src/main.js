import { createApp } from 'vue';
import App from '@/App.vue'; // Importamos el componente raíz
import router from './router'; // Importamos el router
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Bootstrap JS
import './styles/custom.css'; // Estilos personalizados
// Importamos jQuery y DataTables
import $ from 'jquery';
import 'datatables.net'; // DataTables JS
import 'animate.css'; // Animaciones de Animate.css

// AOS para animaciones de desplazamiento
import AOS from 'aos';
import 'aos/dist/aos.css';

// Importamos Element Plus y sus estilos
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

// Inicializamos la aplicación de Vue
const app = createApp(App);

// Configuración de AOS
AOS.init({
  duration: 1000, // Duración de la animación
  once: true, // Las animaciones ocurren una vez
});

// Hacemos que jQuery y DataTables estén disponibles globalmente
app.config.globalProperties.$ = $;  // jQuery
app.config.globalProperties.$DataTable = $.fn.DataTable;  // DataTables

// Uso del router en la app
app.use(router);

// Uso de Element Plus en la app
app.use(ElementPlus);

// Montamos la app en el elemento #app del DOM
app.mount('#app');
