import { createApp } from 'vue';
import App from '@/App.vue';
import router from './router';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './styles/custom.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import $ from 'jquery';

const app = createApp(App);

AOS.init({
  duration: 1000,
  once: true,
});
app.use(router);
app.mount('#app');
