import Vue from 'vue'
import App from './App'
import store from './store/index.js';
import TfButton from '@/components/tf/tf-button.vue';

Vue.config.productionTip = false
Vue.prototype.$store = store;

// 全局注册
Vue.component('tf-button', TfButton);

App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()
