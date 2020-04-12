<template>
	<text class="tf-icon iconfont" 
	 :class="'icon' + icon" @click="$emit('click')"
	 :style="{ fontSize: size + 'px' }"
	 ></text>
</template>

<script>
	export default {
		name: 'TfIcon',
		
		props: {
			icon: String,
			size: {
				type: Number,
				default: 16
			}
		}
	}
</script>

<style>
	.tf-icon {
		font-size: 32rpx;
		margin-right: 12rpx;
		text-align: center;
	}
</style>
