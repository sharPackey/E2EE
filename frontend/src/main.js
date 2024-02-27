import {createApp} from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from "axios";
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';



axios.defaults.baseURL = '/api';

const app = createApp(App);

app.config.globalProperties.$http = axios;
app.use(ElementPlus)
Object.keys(ElementPlusIconsVue).forEach((key) => {
    app.component(key, ElementPlusIconsVue[key])
})

app.use(store).use(router).mount('#app')
