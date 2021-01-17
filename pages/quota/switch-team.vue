<template>
	<view class="tf-page">
		<view class="list-container">
			<view class="list-item" 
				:class="[item.id === team_id && 'current']"
				v-for="item in teams" 
				:key="item.id" 
				@click="onSwitchTeam(item.id)"
			>{{ item.name}}</view>
		</view>
		<view class="footer">
			<tf-button type="primary" @click="onCreate">创建新团队</tf-button>
		</view>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';
	import { getTeam } from '@/common/js/db.js';
	
	export default {
		data() {
			return {
				team_id: uni.getStorageSync('TEAM_ID')
			}
		},
		
		computed:{
			...mapState(['teams'])
		},
		
		methods: {
			onCreate() {
				uni.navigateTo({
					url: '../index/index?is_create=1'
				});
			},
			
			onSwitchTeam(id) {
				if(id === this.team_id) return;
				this.team_id = id;
				this.loadTeam().then(() => {
					uni.navigateBack({});
				});
			},
			
			loadTeam() {
				return getTeam(this.team_id).then(res => {
					uni.setStorageSync('TEAM_ID', this.team_id);
					this.setTeam(res.data);
				});
			},
			
			...mapMutations({
				setTeam: 'SET_TEAM'
			})
		}
	}
</script>

<style lang="scss">
	.list-container {
		height: calc(100vh - 70px);
		overflow-y: auto;
		.list-item {
			padding: 10px 28px;
			font-size: 28rpx;
			color: $font-color;
			border-bottom: 1px solid #eee;
			&.current {
				color: $color-primary;
			}
		}
	}
	
	.footer {
		height: 70px;
		padding: 10px;
		padding-bottom: 0px;
	}
</style>
