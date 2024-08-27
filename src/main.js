import { createApp } from 'vue';
import App from './views/App.vue';
import router from './router';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './styles/custom.css';

createApp(App)
  .use(router)
  .mount('#app');
