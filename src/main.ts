import './assets/scss/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import BaseWidth from '@/components/BasicComponents/BaseWidth.vue'
import BaseTable from '@/components/BasicComponents/BaseTable.vue'
import BasePagination from '@/components/BasicComponents/BasePagination.vue'
import BaseInput from '@/components/BasicComponents/BaseInput.vue'
import BaseSpinner from '@/components/BasicComponents/BaseSpinner.vue'
import BaseButton from '@/components/BasicComponents/BaseButton.vue'
import BaseModal from '@/components/BasicComponents/BaseModal.vue'

const app = createApp(App)

app.component('BaseWidth', BaseWidth)
app.component('BaseTable', BaseTable)
app.component('BasePagination', BasePagination)
app.component('BaseInput', BaseInput)
app.component('BaseSpinner', BaseSpinner)
app.component('BaseButton', BaseButton)
app.component('BaseModal', BaseModal)

app.use(createPinia())
app.use(router)

app.mount('#app')
