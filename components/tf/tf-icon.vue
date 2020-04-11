<template>
	<text class="tf-icon iconfont" :class="'icon' + icon" @click="$emit('click')"></text>
</template>

<script>
	export default {
		name: 'TfIcon',
		
		props: {
			icon: String
		}
	}
</script>

<style>
	.tf-icon {
		font-size: 32rpx;
		margin-right: 12rpx;
	}
</style>
