import Vue from 'vue'
import App from './App'
import store from './store/index.js';
import TfButton from '@/components/tf/tf-button.vue';
import TfIcon from '@/components/tf/tf-icon.vue';
import TfAvatar from '@/components/tf/tf-avatar.vue';

Vue.config.productionTip = false
Vue.prototype.$store = store;

// 全局注册
Vue.component('tf-button', TfButton);
Vue.component('tf-icon', TfIcon);
Vue.component('tf-avatar', TfAvatar);

App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()
