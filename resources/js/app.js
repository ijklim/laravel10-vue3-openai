/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

import './bootstrap';
import { createApp } from 'vue';

/**
 * Next, we will create a fresh Vue application instance. You may then begin
 * registering components with the application instance so they are ready
 * to use in your application's views. An example is included for you.
 */
// Root component
import App from '@/App.vue';
const app = createApp(App);

// Add Routing
import router from '@/router/index.js';
app.use(router);

// import ExampleComponent from './components/ExampleComponent.vue';
// app.component('example-component', ExampleComponent);

/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// Object.entries(import.meta.glob('./**/*.vue', { eager: true })).forEach(([path, definition]) => {
//     app.component(path.split('/').pop().replace(/\.\w+$/, ''), definition.default);
// });

/**
 * Finally, we will attach the application instance to a HTML element with
 * an "id" attribute of "app". This element is included with the "auth"
 * scaffolding. Otherwise, you will need to add an element yourself.
 */

// Vuetify, doc: https://vuetifyjs.com/en/getting-started/installation/
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
// Vuetify Icon Fonts library, doc: https://vuetifyjs.com/en/features/icon-fonts/
// Note: Must add cdn in `resources/views/welcome.blade.php`
import { aliases, mdi } from 'vuetify/iconsets/mdi'
// Note: The following imports can be skipped with vite-plugin-vuetify, ref: https://vuetifyjs.com/en/features/treeshaking/
// import * as components from 'vuetify/components';
// import * as directives from 'vuetify/directives';

const vuetify = createVuetify({
  // components,
  // directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    // Using dark instead of light theme
    defaultTheme: 'dark',
  },
});
app.use(vuetify);

app.mount('#app');
