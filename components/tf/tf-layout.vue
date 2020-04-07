<template>
	<view class="tf-layout">
		<view class="bg">
			<view class="raduis-bg" :style="{marginTop: mgTop + 'px'}"></view>
		</view>
		<view class="content">
			<slot name="header"></slot>
			<slot></slot>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			mgTop: {
				type: Number,
				default: 100
			}
		},
		
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
.tf-layout {
	height: 100%;
	position: relative;
	>view {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		overflow: hidden;
	}
	.bg {
		background-color: $color-primary;
		.raduis-bg {
			height: 100%;
			background-color: #fff;
			border-radius: 40px;
		}
	}
}
</style>
