<template>
	<view class="invite-page">
		<view class="content">
			<image src="../../static/img/invite.png"></image>
			<text class="text">Hi, 你来了~</text>
			<text class="text">{{ master }} 邀请你加入 {{ team_name }} 团队</text>
			<button class="join-btn" open-type="getUserInfo" @click="subscribe" @getuserinfo="join">立即加入</button>
			<text class="create-my" @click="createTeam">我要创建自己的团队</text>
		</view>
	</view>
</template>

<script>
	import { mapState, mapActions, mapMutations } from 'vuex';
	import { getCollection, getTeam, command as _ , getMyTeams } from '../../common/js/db.js';
	import Team from '../../common/js/Team.js';
	
	let subscribeResolve;
	let subscribeProm = new Promise((resolve) => subscribeResolve = resolve);
	
	export default {
		data() {
			return {
				master: '',
				team_name: ''
			}
		},
		
		computed: {
			...mapState(['openid'])
		},
		
		onLoad({info}) {
			info = JSON.parse(info);
			this.master = info.master
			this.team_id = info.team_id
			this.team_name = info.team_name
		},
		
		onShow() {
			uni.hideHomeButton();
			// 判断是否在改团队里面
			if(this.openid && this.team_id) {
				getMyTeams(this.openid).then(res => {
					const index = res.findIndex(item => item.id === this.team_id);
					if(index > -1) {
						uni.redirectTo({
							url: '../rank/rank?team_id=' + this.team_id
						});
					}
				});
			}
		},
		
		methods: {
			createTeam() {
				uni.navigateTo({
					url: '../index/index?is_create=1'
				})
			},
			
		  join(e) {
				// 授权成功
				if(e.detail) {
					const { userInfo } = e.detail;
					this.setUserInfo(userInfo);
					
					let prom;
					if(!this.openid) {
						prom = this.login();
					} else {
						prom = Promise.resolve(this.openid);
					}
					
					prom.then(openid => {
						if(!this.team_id) return Promise.reject('团队不存在');
						
						const member = Team.generateMember(this.openid, userInfo);
						// 添加成员
						return wx.cloud.callFunction({
							name: 'team',
							data: {
								type: 'add_member',
								params: {
									team_id: this.team_id,
									member
								}
							}
						});
					}).then(() => {
						// 订阅消息操作后才能跳转
						return subscribeProm;
					}).then(() => {
						uni.redirectTo({
							url: '../rank/rank?team_id=' + this.team_id
						});
					}).catch((reason) => {
						this.$toast(reason);
					});
				}
			},
			
			// 订阅消息
			subscribe() {
				wx.requestSubscribeMessage({
					tmplIds: ['VuohxXh57VvHSkihzpk94WtkpuLiRL3XJFXXhttd6Sw', 'ct4NV_LQ7AhLpkulV-feI7AOFHnxgZJuI-X8a2aVlF8'],
					complete(){
						subscribeResolve();
					}
				});
			},
			
			...mapMutations({
				setUserInfo: 'SET_USERINFO'
			}),
			...mapActions(['login'])
		}
	}
</script>

<style lang="scss">
	.invite-page {
		height: 100%;
		background-color: #f8f8f8;
		padding: 30px;
		margin-top: 35%;
		.content {
			display: flex;
			flex-direction: column;
			image {
				width: 45px;
				height: 50px;
				margin-bottom: 6px;
			}
			.text {
				color: #666;
				font-size: 32rpx;
				margin-top: 6px;
				margin-left: 6px;
			}
			/deep/ .tf-button {
				margin-top: 36px;
				width: 320px;
			}
			.create-my {
				color: #999;
				font-size: 26rpx;
				margin-top: 20px;
				text-align: center;
			}
			.join-btn {
				border-radius: 30px;
				font-size: 26rpx;
				color: #fff;
				padding: 4px 0px;
				background-color: $color-primary;
				width: 310px;
				margin-top: 35px;
			}
		}
	}
</style>
