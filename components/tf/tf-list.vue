<template>
	<view class="list">
		<tf-list-item
			v-for="(member, index) in members" 
			:key="member.key"
			:member="member"
		>
		</tf-list-item>
	</view>
</template>

<script>
	import TfListItem from './tf-list-item.vue';
	
	export default {
		name: 'TfList',
		
		components: {
			TfListItem
		},
		
		props:{
			members: {
				type: Array,
				default: () => []
			}
		},
		
		methods: {
			toDetail(detail_id) {
				uni.navigateTo({
					url: '../../pages/rank/detail?detail_id=' + detail_id
				});
			}
		}
	}
</script>

<style lang="scss">
	.list{
		
	}
</style>
