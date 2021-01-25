// mutations

import * as types from './mutation-types.js'

const mutations = {
	[types.SET_USERINFO](state, userInfo) {
		state.userInfo = userInfo;
	},
	[types.SET_OPEN_ID](state, openid) {
		state.openid = openid;
		uni.setStorageSync('OPEN_ID', openid);
	},
	[types.SET_MY_TEAMS](state, teams) {
		state.teams = teams;
	},
	[types.SET_TEAM](state, team) {
		state.team = team;
	},
	[types.SET_MODE](state, mode) {
		state.team.mode = mode;
	},
	[types.SET_ONSHOW_TRIGGER](state, status) {
		state.triggerShowHook = status;
	}
}

export default mutations;