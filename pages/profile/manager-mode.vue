<template>
	<view class="tf-page tf-manager-mode-page">
		<view class="cards">
			<view class="card" :class="[mode === 'HELP' && 'active']" @click="mode='HELP'">
				<text class="tf-icon tf-icon-helpmode"></text>
				<text class="text">互助模式</text>
			</view>
			<view class="card" :class="[mode === 'CTRO' && 'active']" @click="mode='CTRO'">
				<text class="tf-icon tf-icon-ctrlmode"></text>
				<text class="text">管控模式</text>
			</view>
		</view>
		<view class="desc">
			<text class="title">说明:</text>
			<text v-if="mode==='HELP'">
				管理员可设置每个成员的小红花赠送额度，小红花额度只能用来赠予团队里你想感谢的人，不能送给自己。
				排行上的红花数显示的就是别人馈赠的红花数，所以理论上讲，得到红花数越多的人是团队里越受欢迎的，或者对团队贡献越大的。
			</text>
			<text v-else>
				只有管理员可对团队成员进行赠送或扣除小红花的操作，团队普通成员不能互相赠送。
				排行榜上的红花数都是管理员依据团队制定好的奖惩规则来执行的，所以得到红花数越多的人，理论上是团队里绩效越好的人。
			</text>
		</view>
		<view class="footer">
			<tf-button type="primary" @click="onSave">保存</tf-button>
		</view>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { getMyTeams } from '@/common/js/db.js';

export default {
	data() {
		return {
			mode: ''   // 管理模式 HELP => 互助模式   CTRO  => 管控模式
		}
	},
	
	computed: {
		...mapState(['team', 'openid'])
	},
	
	created() {
		if(this.team) {
			this.mode = this.team.mode || 'HELP'
		}
	},
	
	methods: {
		onSave() {
			let prom;
			if(this.mode === this.team.mode) {
				prom = Promise.resolve()
			} else {
				this.setMode(this.mode);
				
				prom = wx.cloud.callFunction({
					name: 'team',
					data: {
						type: 'update_mode',
						params: {
							team_id: this.team._id,
							mode: this.mode
						}
					}
				})
			}
			
			prom.then(() => {
				this.$toast('设置成功');
				return getMyTeams(this.openid);
			}).then(res => {
				this.setTeams(res);
				uni.navigateBack({});
			}).catch(e => {
				this.$toast('设置失败: ' + e.message);
			})
		},
		
		...mapMutations({
			setMode: 'SET_MODE',
			setTeams: 'SET_MY_TEAMS',
		})
	}
}
</script>

<style lang="scss">
.tf-manager-mode-page {
	display: flex;
	flex-direction: column;
	.cards {
		flex: 0 0 auto;
		display: flex;
		padding: 20px 10px;
		.card {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 20px 0px;
			margin: 0px 10px;
			border: 1px solid #eee;
			border-radius: 8rpx;
			.tf-icon {
				color: #ccc;
				font-size: 54rpx;
				margin-bottom: 10px;
			}
			.text {
				color: #999;
				font-size: 32rpx;
			}
			&.active {
				background-color: $color-primary;
				border-color: $color-primary;
				.text, .tf-icon {
					color: #fff;
				}
			}
		}
	}
	.desc {
		flex: 1;
		padding: 14px 22px;
		color: font-color;
		font-size: 28rpx;
		.title {
			display: block;
			font-size: 32rpx;
			font-weight: bold;
			margin-bottom: 8px;
		}
	}
	.footer {
		flex: 0 0 70px;
		padding: 10px;
	}
}
</style>
