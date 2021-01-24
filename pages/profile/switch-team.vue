<template>
	<view class="tf-page tf-switch-team-page">
		<view class="list-container">
			<view class="list-item" 
				:class="[item.id === team_id && 'current']"
				v-for="item in teams" 
				:key="item.id" 
				@click="onSwitchTeam(item.id)"
			>
				<text class="name">{{ item.name}}</text>
				<u-tag v-if="item.mode === 'HELP'" text="互助" shape="circle" color="#1AAD19" border-color="#1AAD19" bg-color="#fff" size="mini"></u-tag>
				<u-tag v-else text="管控" shape="circle" color="#FF6600" border-color="#FF6600" bg-color="#fff" size="mini"></u-tag>
			</view>
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
			padding: 12px 28px;
			font-size: 28rpx;
			color: $font-color;
			border-bottom: 1px solid #eee;
			display: flex;
			align-items: center;
			.name {
				flex: 1;
			}
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
