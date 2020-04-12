<template>
	<button class="tf-button" 
		:class="['tf-button-' + type, { 'tf-button-small': size === 'small'}]"
		:style="{width: width ? width + 'px' : ''}">
		<text v-if="icon" class="iconfont" :class="'icon' + icon"></text>
		<slot></slot>
	</button>
</template>

<script>
	export default {
		name: 'TfButton',
		
		props: {
			type: {
				type: String,
				default: 'primary'
			},
			size: String,
			width: Number,
			icon: String
		}
	}
</script>

<style lang="scss">
	.tf-button {
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 30px;
		font-size: 26rpx;
		color: #fff;
		padding: 4px 0px;
		>text {
			font-size: 36rpx;
			margin-right: 6px;
		}
		&.tf-button-primary {
			background-color: $color-primary;
		}
		&.tf-button-assia {
			background-color: #FF6600;
		}
		&.tf-button-small {
			font-size: 24rpx;
			padding: 2px 0px;
			height: 36px;
		}
	}
</style>
