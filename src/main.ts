/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import {registerPlugins} from '@/plugins'
// //
// // Components
// import App from './App.vue'
// //
// // Composables
// import { createApp } from 'vue'
//
// const app = createApp(App)
//
//
// app.mount('#app')
import {createApp} from 'vue';
import './styles/styles.css'

import App from './App.vue';
import {createVuetify} from 'vuetify';
import 'vuetify/styles';

const vuetify = createVuetify({
  theme: {
    // defaultTheme: 'dark',
  },
});
const app = createApp(App);

registerPlugins(app)

app.use(vuetify);

app.mount('#app');
