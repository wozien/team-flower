<template>
	<view class="profile-page">
		<view class="header">
			<view class="bg">
				<view class="info">
					<tf-avatar :url="my.avatar" :size="55" class="avatar" />
					<view class="name-and-quota">
						<text class="name">{{ my.nickname }}</text>
						<view class="quota">
							小红花余额: <text>{{ isMaster ? 9999 +'+' : my.quota }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	
	export default {
		data() {
			return {
				
			};
		},
		
		computed: {
			my() {
				return this.team.members.find(member => member.openid === this.openid)
			},
			isMaster() {
				return this.team.master_id === this.openid;
			},
			...mapState(['team', 'openid'])
		},
		
		onShow() {
			uni.setNavigationBarTitle({
				title: this.team.name
			})
		}
	}
</script>

<style lang="scss">
.profile-page {
	height: 100%;
	.header {
		overflow: hidden;
		position: relative;
		height: 104px;
		.bg {
			background-color: $color-primary;
			height: 70px;
		}
		.info {
			background-color: #fff;
			border-radius: 10px;
			position: absolute;
			top: 20px;
			left: 20px;
			right: 20px;
			bottom: 4px;
			box-shadow: 4px 4px 4px -4px #ccc;
			display: flex;
			align-items: center;
			padding: 0px 30px;
			.tf-avatar {
				width: 55px;
				height: 55px;
			}
			.name-and-quota {
				flex: 1;
				margin-left: 10px;
				display:  flex;
				flex-direction: column;
				color: #666;
				.name {
					font-size: 36rpx;
					font-weight: 600;
				}
				.quota {
					font-size: 28rpx;
					margin-top: 4px;
					> text {
						color: #FF6600;
						font-weight: 600;
						margin-left: 10px;
					}
				}
			}
		}
	}
}
</style>
