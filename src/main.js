import { createApp } from 'vue';
import { createPinia } from 'pinia'; // Import Pinia
import App from './App.vue';
import './assets/tailwind.css';
import router from './router';

const app = createApp(App);

// Crée une instance de Pinia
const pinia = createPinia();

// Utilise Pinia et le routeur
app.use(pinia);
app.use(router);

app.mount('#app');