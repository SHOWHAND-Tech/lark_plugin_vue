import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'
import 'element-plus/theme-chalk/src/message-box.scss'
import 'element-plus/theme-chalk/src/message.scss'
import 'element-plus/dist/index.css'
// import {i18n} from './locales/i18n.js'
// createApp(App).use(i18n).mount('#app') // 注入国际化函数$t

import router from './router'

createApp(App).use(router).mount('#app')
