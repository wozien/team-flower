// mutations

import * as types from './mutation-types.js'

const mutations = {
	[types.SET_USERINFO](state, userInfo) {
		state.userInfo = userInfo;
		uni.setStorageSync('USER_INFO', userInfo);
	}
}

export default mutations;