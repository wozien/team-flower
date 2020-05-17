<template>
	<view class="create-page">
		<view class="slogan">
			<text>不知道如何激励年轻员工？</text>
			<text>也许你该试试更年轻的管理方式</text>
			<text class="name">--- 团队小红花</text>
		</view>
		<button class="btn" 
			open-type="getUserInfo"
			@click="subscribe"
		  @getuserinfo="onGetUserInfo"
		>立即创建团队</button>
	</view>
</template>

<script>
	import { mapState, mapActions, mapMutations } from 'vuex';
	import { getMyTeams } from '@/common/js/db.js';
	
	let subscribeResolve;
	let subscribeProm = new Promise((resolve) => subscribeResolve = resolve);
	
	export default {	
		computed: {
			...mapState(['openid'])
		},
		
		onLoad({is_create}) {
			this.isCreate = is_create || false;
			// 授权用户获取用户信息
			uni.getSetting({
				success: res => {
					if(res.authSetting['scope.userInfo']) {
						uni.getUserInfo({
							success: res => {
								this.setUserInfo(res.userInfo);
							}
						})
					}
				}
			})
		},
		
		onShow() {
			if(this.isCreate) return;
			
			// 登录成功查询我的团队数据
			let prom;
			if(!this.openid){
				prom = this.login();	
			} else {
				prom = Promise.resolve(this.openid)
			}
			
			prom.then(openid => {
				if(openid) {
					getMyTeams(openid).then(res => {
						if(res.length) {
							// 跳转rank页面
							const team_id = uni.getStorageSync('TEAM_ID') || res[0].id;
							uni.navigateTo({
								url: '../rank/rank?team_id=' + team_id
							});
						}
					})
				}
			});
		},
		
		methods: {
			onGetUserInfo(e) {		
				// 授权成功
				if(e.detail) {
					this.setUserInfo(e.detail.userInfo);
					
					let prom = Promise.resolve();
					if(!this.openid){
						prom = this.login();	
					}
					
					Promise.all([prom, subscribeProm]).then(() => {
						uni.navigateTo({
							url: '../create/create'
						})
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
	.create-page {
		position: relative;
		height: 100%;
		background-color: $color-primary;
		overflow: hidden;
		padding: 50px 40px;
		.slogan {
			margin-top: 70px;
			flex: 1;
			text {
				display: block;
				color: #fff;
				font-size: 36rpx;
				font-weight: 600;
				margin-bottom: 14px;
				&.name {
					margin-top: 28px;
					text-align: right;
				}
			}
		}
		.btn {
			position: absolute;
			left: 40px;
			right: 40px;
			bottom: 50px;
			font-size: 32rpx;
			font-weight: 600;
			color: $color-primary;
			background-color: #fff;
			border-radius: 30px;
			padding: 4px 0px;
		}
	}
</style>

