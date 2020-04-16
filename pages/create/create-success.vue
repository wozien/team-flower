<template>
	<view class="create-success">
		<icon type="success" size="60" color="#7F83BB"></icon>
		<text class="flg">创建成功</text>
		<text class="step-text" @click="invite">最后一步，快邀请好友加入你的团队</text>
		<tf-button type="primary" 
		   :width="320" 
			 style="margin-top: 40px"
			 @click.native="invite">邀请成员</tf-button>
		<text class="goto" @click="toRank">先进去看看</text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				info: {}
			}
		},
		
		onLoad({ info }) {
			console.log(info)
			this.info = info
		},
		
		methods: {
			invite() {
				uni.navigateTo({
					url: './invite?info=' + this.info
				})
			},
			toRank() {
				uni.navigateTo({
					url: "../rank/rank?team_id=" + this.teamId
				})
			}
		}
	}
</script>

<style lang="scss">
	.create-success {
		background-color: $bg-color;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 60rpx;
		
		.flg {
			color: #333;
			font-size: 32rpx;
			margin-top: 28rpx;
		}
		.step-text {
			color: #666;
			font-size: 26rpx;
			margin-top: 20rpx;
		}
		.goto {
			color: #999;
			font-size: 26rpx;
			margin-top: 24rpx;
		}
	}
</style>
