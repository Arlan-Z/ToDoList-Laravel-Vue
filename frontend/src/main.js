import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import 'vuetify/dist/vuetify.min.css';

createApp(App)
  .use(router)
  .use(vuetify)
  .mount('#app');
