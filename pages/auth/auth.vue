<template>
	<view class="tf-page auth-page">
		<view class="logo">
			<image src="../../static/img/team-flower.png" mode="aspectFill">
		</view>
		<view class="desc">
			<text>团队小红花是一个适用于团队氛围建设，更有趣，年轻化的积分管理工具。</text>
			<text>管理员可以创建不同模式的团队，团队成员之间在不同模式下互动方式也会不同。</text>
			<text>你还可以实时看到积分排行榜和详细的流水记录，让团队管理更加有条不紊，赶紧创建一个团队试试吧！</text>
		</view>
		<button class="btn"  open-type="getUserInfo" @getuserinfo="onGetUserInfo">微信用户一键登录</button>
		<view class="tip">微信用户信息将作为团队成员头像和昵称</view>
	</view>
</template>

<script>
	import { mapState, mapActions, mapMutations } from 'vuex';
	import { getMyTeams } from '@/common/js/db.js';
	
	export default {
		computed: {
			...mapState(['openid'])
		},
		
		methods: {
			onGetUserInfo(e) {	
				// 授权成功
				if(e.detail) {

					if(e.detail.errMsg === 'getUserInfo:fail auth deny') {
						this.$toast('小程序服务需要您授权微信用户信息哦~', 'none', 3000)
						return;
					}
					
					this.setUserInfo(e.detail.userInfo);
					
					let prom = Promise.resolve(this.openid);
					if(!this.openid){
						prom = this.login();	
					}
					
					prom.then(() => this._gotoRankPage())
				} 
			},
			
			_gotoRankPage() {
				let team_id = uni.getStorageSync('TEAM_ID');
				let prom;
				
				if(team_id) {
					prom = Promise.resolve(team_id);
				} else {
					prom = getMyTeams(this.openid).then(res => {
						return res.length && res[0].id;
					})
				}
				
				prom.then(team_id => {
					if(team_id) {
						uni.setStorageSync('TEAM_ID', team_id);
						uni.switchTab({
							url: '../rank/rank'
						});
					} else {
						uni.navigateTo({
							url: '../create/create'
						})
					}
				})
			},
			
			...mapMutations({
				setUserInfo: 'SET_USERINFO'
			}),
			...mapActions(['login'])
		}
	}
</script>

<style lang="scss">
.auth-page {
	padding: 20px;
	padding-bottom: 50px;
	display: flex;
	flex-direction: column;
	align-items: center;
	.logo {
		flex: 0 0 auto;
		width: 80px;
		height: 80px;
		border-radius: 50%;
		overflow: hidden;
		image {
			width: 80px;
			height: 80px;
		}
	}
	.desc {
		flex: 1;
		width: 100%;
		padding: 20px;
		margin-top: 20px;
		text {
			display: inline-block;
			font-size: 28rpx;
			line-height: 2;
			color: $font-color;
			text-indent: 2em;
		}
	}
	.btn {
		flex: 0 0 auto;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 30px;
		font-size: 28rpx;
		border: 1px solid $color-assistant-2;
		color: #fff;
		background-color: $color-assistant-2;
		width: 240px;
		padding: 4px 0px;
		&.tf-button-plain {
			color: $color-assistant-2;
		}
		text {
			font-size: 36rpx;
			margin-right: 6px;
		}
		&::after {
			border: none;
		}
	}
	.tip {
		font-size: 24rpx;
		color: $font-color-light-1;
		padding: 10px ;
		text-align: center;
	}
}
</style>
