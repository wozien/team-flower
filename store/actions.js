import * as types from './mutation-types.js';

const actions = {
	// 小程序登录
	login({ commit }) {
		// 获取openid
		wx.cloud.callFunction({
			name: 'login'
		}).then(res => {
			if(res.errMsg === "cloud.callFunction:ok") {
				const { openid } = res.result;
				commit(types.SET_OPEN_ID, openid);
			}
		})
	}
}

export default actions;
