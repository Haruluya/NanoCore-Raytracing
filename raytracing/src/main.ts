import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/routers';
const app = createApp(App)

app.use(router)

app.mount('#app')