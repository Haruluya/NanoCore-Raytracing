import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import NanoCoreUI from 'nanocore-ui'
import router from './router/routers';

import nano_raytracing_page from './pages/nano_raytracing_page.vue'
import nano_raytracing_canvas from './components/nano_raytracing_canvas/nano_raytracing_canvas.vue'



const app = createApp(App)
app.use(router)
app.use(NanoCoreUI)
app.component(nano_raytracing_page.name,nano_raytracing_page).component(nano_raytracing_canvas.name,nano_raytracing_canvas);

app.mount('#app')


