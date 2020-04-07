import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations.js';

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		userInfo: uni.getStorageSync('USER_INFO') || null
	},
	mutations
})

export default store
