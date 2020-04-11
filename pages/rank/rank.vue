<template>
	<view class="rank-page">
		<view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
		<view class="menu" slot="left">
			<tf-icon icon="menu" @click="visible=true"></tf-icon>
			<text>{{ team.name }}</text>
		</view>
		<view class="content" :style="{ height: contentHeight + 'px' }">
			<tf-layout></tf-layout>
		</view>
		
		<!-- 侧栏 -->
		<uni-drawer :visible="visible" @close="visible=false">
			<view :style="{ marginTop: statusBarHeight + 'px' }">侧栏</view>
		</uni-drawer>
	</view>
</template>

<script>
	import TfLayout from '@/components/tf/tf-layout.vue';
	import uniDrawer from "@/components/uni-drawer/uni-drawer.vue"
	import { mapState } from 'vuex';
	import { getCollection } from '@/common/js/db.js';
	
	const systemInfo = uni.getSystemInfoSync();
	const statusBarHeight = systemInfo.statusBarHeight
	const contentHeight = systemInfo.screenHeight - 40 - statusBarHeight
	
	export default {
		components: {
			TfLayout,
			uniDrawer
		},
		
		data() {
			return {
				team: {},
				visible: false,
				statusBarHeight: statusBarHeight,
				contentHeight: contentHeight
			}
		},
		
		computed:{
			...mapState(['teams'])
		},
		
		onLoad({team_id}) {
			console.log(team_id)
			const teamCollection = getCollection('team');
			teamCollection.doc(team_id).get().then(res => {
				if(res.errMsg === 'document.get:ok') {
					this.team = res.data;
				}
			})
		}
	}
</script>

<style lang="scss">
	.rank-page {
		height: 100%;
		.status-bar {
			background-color: $color-primary;
			width: 100%;
			height: 20px;
			// height: var(--status-bar-height)
		}
		.menu {
			height: 40px;
			background-color: $color-primary;
			color: #fff;
			text-align: left;
			line-height: 40px;
			padding-left: 8px;
		}
		.content{
		}
	}
</style>
