
class Team {
	name = '';                // 队名
	master_id = '';           // 创建人openid 
	members = [];             // 成员
	
	constructor(name, master_id, user) {
		this.name = name;
		this.master_id = master_id;
		this.date = new Date();
		
		const member = Team.generateMember(master_id, user);
		member.quota = 999999;              // 管理员额度
		this.members = [member];
	}
	
	static generateMember(openid, userInfo) {
		return {
			openid,
			nickname: userInfo.nickName,
			avatar: userInfo.avatarUrl,
			flowers: 0,
			quota: 100,
			is_delete: 0
		}
	}
}

export default Team;