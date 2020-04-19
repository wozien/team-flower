import * as types from './mutation-types.js';

const actions = {
	// 小程序登录
	login({ commit }) {
		// 获取openid
		return wx.cloud.callFunction({
			name: 'login'
		}).then(res => {
			const { openid } = res.result;
			commit(types.SET_OPEN_ID, openid);
			return openid;
		})
	}
}

export default actions;
