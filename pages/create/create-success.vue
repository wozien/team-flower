<template>
	<view class="create-success">
		<icon type="success" size="60" color="#7F83BB"></icon>
		<text class="flg">创建成功</text>
		<text class="step-text" @click="invite">最后一步，快邀请好友加入你的团队</text>
		<tf-button type="primary" :width="320" style="margin-top: 40px" open-type="share">邀请成员</tf-button>
		<text class="goto" @click="gotoRank">先进去看看</text>
	</view>
</template>

<script>
	export default {		
		onLoad({ info }) {
			this.info = JSON.parse(info);
		},
		
		onShareAppMessage() {
			return {
				title: this.info.master + '邀请你加入' + this.info.team_name,
				imageUrl: '../../static/img/invite.png',
				path: '/pages/invite/invite?info=' + JSON.stringify(this.info)
			}
		},
		
		methods: {
			gotoRank() {
				uni.setStorageSync('TEAM_ID', this.info.team_id);
				// 订阅消息
				wx.requestSubscribeMessage({
					tmplIds: ['VuohxXh57VvHSkihzpk94WtkpuLiRL3XJFXXhttd6Sw', 'ct4NV_LQ7AhLpkulV-feI7AOFHnxgZJuI-X8a2aVlF8'],
					complete: () => {
						uni.switchTab({
							url: '../rank/rank'
						});
					}
				});
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
