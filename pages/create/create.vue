<template>
	<view class="create-page">
			<text>请输入你的团队名称</text>
			<input type="text" :focus="true"/>
			<tf-button type="primary" class="create-btn">立即创建</tf-button>
	</view>
</template>

<script>
	
	export default {
		onShow() {
			console.log('show')
			setTimeout(() => {
				uni.setNavigationBarColor({
					frontColor: '#000000'
				})
				uni.setNavigationBarTitle({
					title: '创建团队'
				})
			}, 400)
			
		}
	}
</script>

<style lang="scss">
	.create-page {
		height: 100%;
		background-color: #f8f8f8;
		padding-top: 20px;
		> text {
			color: #999;
			padding-left: 10px;
		}
		
		> input {
			background: #fff;
			padding: 10px;
			color: #999;
			margin-top: 10px;
			margin-bottom: 50px;
		}
		
		.create-btn {
			display: block;
			margin:0px  10px;

		}
		
	}
</style>

