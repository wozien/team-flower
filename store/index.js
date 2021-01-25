import Vue from 'vue';
import Vuex from 'vuex';
import actions from './actions.js';
import mutations from './mutations.js';

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		openid: uni.getStorageSync('OPEN_ID') || '',
		userInfo: null,
		teams: [],
		team: {},
		triggerShowHook: true
	},
	actions,
	mutations
})

export default store
