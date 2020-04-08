// mutations

import * as types from './mutation-types.js'

const mutations = {
	[types.SET_USERINFO](state, userInfo) {
		state.userInfo = userInfo;
	},
	[types.SET_OPEN_ID](state, openid) {
		state.openid = openid;
		uni.setStorageSync('OPEN_ID', openid);
	}
}

export default mutations;