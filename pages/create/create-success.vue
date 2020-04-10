<template>
	<div class="create-success">
		<icon type="success" size="60" color="#7F83BB"></icon>
		<text class="flg">创建成功</text>
		<text class="step-text">最后一步，快邀请好友加入你的团队</text>
		<tf-button type="primary" :width="320" style="margin-top: 40px">邀请成员</tf-button>
		<text class="goto">先进去看看</text>
	</div>
</template>

<script>
	export default {
		onLoad({ team_id }) {
			console.log(team_id)
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
