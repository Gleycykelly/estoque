import { createApp } from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import { loadFonts } from './plugins/webfontloader';
import router from './router';
import { createPinia } from 'pinia';
import { LoadingPlugin } from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import VueTheMask from 'vue-the-mask';
import './assets/css/variables.css';
import money from 'vuejs-money';

loadFonts();

createApp(App)
  .use(createPinia())
  .use(router)
  .use(vuetify)
  .use(VueTheMask)
  .use(LoadingPlugin)
  .use(money)
  .mount('#app');
