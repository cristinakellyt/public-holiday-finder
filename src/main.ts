import './assets/scss/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import BaseWidth from '@/components/BasicComponents/BaseWidth.vue'
import BaseTable from '@/components/BasicComponents/BaseTable.vue'

const app = createApp(App)

app.component('BaseWidth', BaseWidth)
app.component('BaseTable', BaseTable)
app.use(createPinia())
app.use(router)

app.mount('#app')
