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
		
		<u-cell-group :border="false">
			<u-cell-item title="切换团队" :arrow="true" @click="onSwitchTeam">
				<u-icon slot="icon" name="team" custom-prefix="tf-icon" size="36" style="margin-right: 8px"></u-icon>
			</u-cell-item>
			<u-cell-item title="设置管理模式" :arrow="true" @click="onSetTeamMode">
				<u-icon slot="icon" name="set" custom-prefix="tf-icon" size="36" style="margin-right: 8px"></u-icon>
			</u-cell-item>
			<u-cell-item title="设置小红花额度" :arrow="true" @click="onSetQuota">
				<u-icon slot="icon" name="flower-plain" custom-prefix="tf-icon" size="36" style="margin-right: 8px"></u-icon>
			</u-cell-item>
			<u-cell-item title="重置排行榜数据" :arrow="true" @click="onResetTeamData">
				<u-icon slot="icon" name="reset" custom-prefix="tf-icon" size="36" style="margin-right: 8px"></u-icon>
			</u-cell-item>
			<u-cell-item :arrow="true">
				<u-icon slot="icon" name="feedback" custom-prefix="tf-icon" size="36" style="margin-right: 8px"></u-icon>
				<button slot="title" open-type="feedback" class="feedback">留言反馈</button>
			</u-cell-item>
		</u-cell-group>
	
		<!-- tabbar -->
		<u-tabbar :list="tabbarList" active-color="#7F83BB" inactive-color="#999999" bg-color="#fff"></u-tabbar>
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	import { getCollection } from '../../common/js/db.js';
	
	export default {		
		computed: {
			my() {
				return this.team.members.find(member => member.openid === this.openid)
			},
			isMaster() {
				return this.team.master_id === this.openid;
			},
			isHelpMode() {
				return !this.team.mode || this.team.mode === 'HELP';
			},
			...mapState(['team', 'openid', 'tabbarList'])
		},

		methods: {
			onSwitchTeam() {
				uni.navigateTo({
					url: './switch-team'
				});
			},
			
			onSetQuota() {
				if(!this._checkPeimission()) return;
				if(!this.isHelpMode) {
					this.$toast('当前是管控模式，普通员工不能互赠红花，不需要设置小红花额度');
					return;
				}
				uni.navigateTo({
					url: '../quota/quota?team_id=' + this.team._id
				});
			},
			
			onSetTeamMode() {
				if(!this._checkPeimission()) return;
				uni.navigateTo({
					url: './manager-mode'
				});
			},
			
			onResetTeamData() {
				if(!this._checkPeimission()) return;
				
				const content= '重置排行榜数据后，所有人的小红花数都将归零重新开始，但赠送记录和扣除记录不会被清楚'
				uni.showModal({
					content,
					success: res => {
						if(res.confirm) {
							this._resetFlowers()
						}
					}
				})
			},
			
			
			// 重置小红花数
			_resetFlowers() {
				const prom1 = wx.cloud.callFunction({
					name: 'team',
					data: {
						type: 'reset_flowers',
						params: {
							team_id: this.team._id
						}
					}
				});
				
				// 增加一条系统重置的log
				const data = {
					team_id: this.team._id,
					from: 'SYSTEM',
					to: '',
					number: 0,
					message: 'RESET_FLOWERS',
					add: false,
					date: new Date()
				}
				const historySet = getCollection('history');
				const prom2 = historySet.add({ data });
				
				Promise.all([prom1, prom2]).then(() => {
					this.$toast('重置小红花成功', 'success');
				}).catch(e => {
					this.$toast('重置失败：' + e.message);
				}) 
			},
			
			_checkPeimission() {
				if(!this.isMaster) {
					this.$toast('您不是该团队的管理员');
					return false;
				}
				return true;
			}
		}
	}
</script>

<style lang="scss">
.profile-page {
	height: calc(100% - 50px - env(safe-area-inset-bottom));
	background-color: #fff;
	position: relative;
	.header {
		overflow: hidden;
		position: relative;
		height: 104px;
		.bg {
			background-color: $color-primary;
			height: 70px;
			border-bottom-left-radius: 20px;
			border-bottom-right-radius: 20px;
		}
		.info {
			background-color: #fff;
			border-radius: 10px;
			position: absolute;
			top: 20px;
			left: 20px;
			right: 20px;
			bottom: 4px;
			box-shadow: 0px 4px 8px -4px #ccc;
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

	.feedback {
		font-size: 28rpx;
		line-height: 25px;
		color: #606266;
		padding-left: 0px;
		padding-right: 230px;
		background-color: transparent;
		&::after {
			border: none;
		}
	}
}
</style>
