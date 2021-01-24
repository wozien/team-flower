const db = wx.cloud.database();

export const command = db.command;

export const getCollection = name => {
	return db.collection(name);
}

export const getDoc = obj => {
	return this.getCollection(obj.name).doc(obj.doc);
}

// 根据队id获取队详情
export const getTeam = teamId => {
	const teamCollection = getCollection('team');
	return teamCollection.doc(teamId).get();
}

// 获取我加入的团队
export const getMyTeams = openid => {
	const teamCollection = getCollection('team');
	return teamCollection.where({
		'members.openid': openid,
	}).get()
		.then(({ data }) => {
			// 处理我在的团队
			let res= [];
			if(data.length) {
				data.forEach(item => {
					const { members } = item;
					const index = members.findIndex(mb => mb.openid === openid && mb.is_delete == 0);
					if(index > -1) {
						res.push({
							id: item._id,
							name: item.name,
							mode: item.mode || 'HELP'
						});
					}
				});
			}
			return res;
		});
}
