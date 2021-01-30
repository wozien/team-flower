<template>
	<view class="create-page">
		<view class="slogan">
			<text>不知道如何激励年轻员工？</text>
			<text>也许你该试试更年轻的管理方式</text>
			<text class="name">--- 团队小红花</text>
		</view>
		<button class="btn" @click="onCreate">立即进入</button>
	</view>
</template>

<script>
	import { mapState, mapActions, mapMutations } from 'vuex';

	export default {	
		computed: {
			...mapState(['openid', 'userInfo'])
		},
		
		onLoad() {
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
			if(!this.openid) {
				this.login();
			}
		},
		
		methods: {
			onCreate() {
				if(this.userInfo) {
					uni.navigateTo({
						url: '../create/create'
					})
				} else {
					uni.navigateTo({
						url: '../auth/auth'
					})
				}
			},
			...mapActions(['login']),
			...mapMutations({
				setUserInfo: 'SET_USERINFO'
			})
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

