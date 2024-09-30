import { createApp } from 'vue';
import App from '@/App.vue';
import router from './router';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './styles/custom.css';
import $ from 'jquery';


createApp(App)
  .use(router)
  .mount('#app');
