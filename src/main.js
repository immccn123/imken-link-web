/**
 * Main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue';

// Composables
import { createApp } from 'vue';

// Plugins
import { registerPlugins } from '@/plugins';

// App store
import { useAppStore } from './store/app';

const app = createApp(App);

registerPlugins(app);

const store = useAppStore();

if (localStorage.getItem('userToken'))
  store.userToken = localStorage.getItem('userToken');

app.mount('#app');
