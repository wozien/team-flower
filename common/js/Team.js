
class Team {
	name = '';
	master_id = '';
	members = [];
	
	constructor(name, user) {
		this.name = name;
		this.master_id = uni.getStorageSync('OPEN_ID');
		this.addMember(this.master_id, user.nickName)
		this.date = new Date();
	}
	
	addMember(openid, nickname) {
		this.members.push({
			openid,
			nickname,
			flowers: 0
		})
	}
}

export default Team;