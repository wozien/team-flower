import Vue from 'vue';
import Vuex from 'vuex';
import actions from './actions.js';
import mutations from './mutations.js';

Vue.use(Vuex);

// tabbar config

const tabbarList = [
	{
		"pagePath":"/pages/rank/rank",
		"text":"排行榜",
		"iconPath":"/static/img/tab-rank.png",
		"selectedIconPath":"/static/img/tab-rank-active.png"
	},
	// {
	// 	"pagePath":"/pages/notice/notice",
	// 	"text":"公告",
	// 	"iconPath":"/static/img/tab-notice.png",
	// 	"selectedIconPath":"/static/img/tab-notice-active.png"
	// },
	{
		"pagePath":"/pages/profile/profile",
		"text":"我的",
		"iconPath":"/static/img/tab-my.png",
		"selectedIconPath":"/static/img/tab-my-active.png"
	}
]

const store = new Vuex.Store({
	state: {
		openid: uni.getStorageSync('OPEN_ID') || '',
		userInfo: null,
		teams: [],
		team: {},
		triggerShowHook: true,
		tabbarList
	},
	actions,
	mutations
})

export default store
