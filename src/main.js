import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/app.css'
import { createPinia } from 'pinia'

import { registerGlobalComponents } from './utils/import'

const app = createApp(App)
registerGlobalComponents(app)
app.use(router)
app.use(createPinia())
app.mount('#app')
