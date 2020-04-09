<template>
	<button class="tf-button" 
		:class="['tf-button-' + type, { 'tf-button-small': size === 'small'}]"
		:style="{width: width ? width + 'px' : ''}">
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
		display: block !important;
		border-radius: 30px;
		font-size: 26rpx;
		color: #fff;
		padding: 4px 0px;
		&.tf-button-primary {
			background-color: $color-primary;
		}
		&.tf-button-small {
			font-size: 24rpx;
			padding: 2px 0px;
		}
	}
</style>
