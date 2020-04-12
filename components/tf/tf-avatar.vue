<template>
	<view class="tf-avatar" :class="{'tf-avatar-large': size === 'large'}">
		<image :src="url" alt="头像" />
	</view>
</template>

<script>
	export default {
		name: 'TfAvatar',
		
		props: {
			url: {
				type: String,
				default: '@/static/img/user-unlogin.png'
			},
			size: String
		}
	}
</script>

<style lang="scss">
	.tf-avatar{
		width: 45px;
		height: 45px;
		border-radius: 50%;
		overflow: hidden;
		&.tf-avatar-large {
			width: 70px;
			height: 70px;
		}
		> image {
			width: 100%;
			height: 100%;
		}
	}
</style>
