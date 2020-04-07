<template>
	<view class="index-page">
		<tf-layout :mgTop="80"></tf-layout>
	</view>
</template>

<script>
	import TfLayout from '@/components/tf/tf-layout.vue';
	
	export default {
		components: {
			TfLayout
		},
		
		data() {
			return {
				
			}
		},
		
		onLoad() {	
		},
		
		methods: {
		}
	}
</script>

<style lang="scss">
.index-page {
	height: 100%;
}
</style>
