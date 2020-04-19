<template>
	<button 
	   class="tf-button"
		:class="['tf-button-' + type, { 'tf-button-small': size === 'small'}]"
		:style="{width: width ? width + 'px' : ''}"
		:open-type="openType || ''"
		@click="$emit('click')">
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
				default: 'default'
			},
			size: String,
			width: Number,
			icon: String,
			openType: String
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
		color: #666;
		padding: 4px 0px;
		border: 1px solid #eee;
		background-color: #fff;
		>text {
			font-size: 36rpx;
			margin-right: 6px;
		}
		&::after {
			border: none;
		}
		&.tf-button-primary {
			color: #fff;
			background-color: $color-primary;
			border-color: $color-primary;
		}
		&.tf-button-assia {
			color: #fff;
			background-color: #FF6600;
			border-color: #FF6600;
		}
		&.tf-button-small {
			font-size: 24rpx;
			padding: 2px 0px;
			height: 36px;
		}
	}
</style>
