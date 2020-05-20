<template>
	<view class="tf-loading" v-show="loading">
		<view></view>
		<view></view>
	</view>
</template>

<script>
	export default {
		name: 'TfLoading',
		props: {
			loading: Boolean
		}
	}
</script>

<style lang="scss">
	@keyframes loading {
		0%, 100% {
			transform: scale(0);
		}
		50% {
			transform: scale(1);
		}
	}
	
	.tf-loading {
		> view {
			position: absolute;
			left: 0;
			top: 0;
			bottom: 0;
			right: 0;
			margin: auto;
			width: 60px;
			height: 60px;
			opacity: 0.6;
			border-radius: 50%;
			background-color: $color-primary;
			animation: loading 1.4s infinite ease-in;
			z-index: 100;
		}
		> view:nth-child(2) {
			animation-delay: -0.7s;
		}
	}
</style>
