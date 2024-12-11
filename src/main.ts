import './assets/scss/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import BaseWidth from '@/components/BasicComponents/BaseWidth.vue'

const app = createApp(App)

app.component('BaseWidth', BaseWidth)
app.use(createPinia())
app.use(router)

app.mount('#app')
