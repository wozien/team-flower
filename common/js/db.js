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
		'members.openid': openid
	}).get()
		.then(({ data }) => {
			let res= [];
			if(data.length) {
				res = data.map(item => {
					return {
						id: item._id,
						name: item.name
					}
				});
			}
			return res;
		});
}
