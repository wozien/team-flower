<template>
	<view class="tf-avatar" 
		:class="{
			'tf-avatar-large': size === 'large',
			'tf-avatar-small': size === 'small',
			'tf-avatar-mini': size === 'mini'
			}"
	>
		<image :src="url" alt="头像" mode="aspectFill"/>
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
		&.tf-avatar-small {
			width: 30px;
			height: 30px;
		}
		&.tf-avatar-mini {
			width: 26px;
			height: 26px;
		}
		> image {
			width: 100%;
			height: 100%;
		}
	}
</style>
