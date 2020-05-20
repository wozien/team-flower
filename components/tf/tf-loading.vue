<template>
	<div class="tf-loading">
		<div></div>
		<div></div>
	</div>
</template>

<script>
	export default {
		name: 'TfLoading'
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
		> div {
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
		> div:nth-child(2) {
			animation-delay: -0.7s;
		}
	}
</style>
