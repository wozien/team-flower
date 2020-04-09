<template>
	<view class="create-page">
		<view class="slogan">
			<text>不知道如何激励年轻员工？</text>
			<text>也许你该试试更年轻的管理方式</text>
			<text class="name">--- 红花榜</text>
		</view>
		<button class="btn" 
			open-type="getUserInfo"
		  @getuserinfo="onGetUserInfo"
		>立即创建团队</button>
	</view>
</template>

<script>
	import { mapState, mapActions, mapMutations } from 'vuex';
	
	export default {
		computed: {
			...mapState(['openid'])
		},
		
		created() {
			// 登录成功查询我的团队数据
			if(this.openid) {
				console.log('search team')
			} else {
				console.log('no login')
			}
		},
		
		onLoad() {
			// 授权用户获取用户信息
			uni.getSetting().then(res => {
				if(res['scope.userInfo']) {
					uni.getUserInfo().then(res => {
						this.setUserInfo(res.userInfo);
					})
				}
			})
		},
		
		methods: {
			onGetUserInfo(e) {
				// 授权成功
				if(e.detail) {
					if(!this.openid){
						this.login();
						this.setUserInfo(e.detail.userInfo)
					}
					uni.navigateTo({
						url: '../create/create'
					})
				}
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

