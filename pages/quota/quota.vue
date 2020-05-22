<template>
	<view class="quota-page">
		<view class="number">
			<text>每人每月可用额度</text>
			<input type="number" v-model="quota" placeholder="0.0" :focus="true" />
		</view>
		<view class="flower">
			<tf-icon icon="flower-plain" :size="34" style="color: #ccc"></tf-icon>
			<text>{{ quota }}</text>
		</view>
		
		<tf-button type="primary" :width="200" @click="setQuota">立即设置额度</tf-button>
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	
	export default {
		data() {
			return {
				quota: 100
			}
		},
		
		computed: {
			...mapState(['team'])
		},

		onLoad({team_id}) {
			this.team_id = team_id;
		},
		
		onShow() {
			uni.setNavigationBarTitle({
				title: '设置小红花初始额度'
			});
			this.quota = this.team.quota || 100;
		},
		
		methods: {
			setQuota() {
				if(+this.quota < 0) {
					this.$toast('小红花额度不能小于0');
					return;
				}
				
				const content = '该项设置将会重置团队所有成员额度，是否继续？';
				uni.showModal({
					content,
					success: res => {
						if(res.confirm) {
							this.exec();
						}
					}
				});
			},
			
			exec() {
				wx.cloud.callFunction({
					name: 'team',
					data: {
						type: 'reset_quota',
						params: {
							team_id: this.team_id,
							quota: +this.quota
						}
					}
				}).then(() => {
					this.$toast('修改额度成功', 'success').then(() => {
						setTimeout(() => {
							uni.navigateBack({});
						}, 600);
					})
				});
			}
		}
	}
</script>

<style lang="scss">
	.quota-page {
		height: 100%;
		background-color: #fff;
		padding: 0 14px;
		overflow: hidden;
		.number {
			background-color: #f1f1f1;
			border-radius: 4px;
			padding: 10px;
			display: flex;
			margin-top: 16px;
			align-items: center;
			> text {
				flex: 0 0 110px;
				font-size: 26rpx;
				color: #999;
				text-align: right;
			}
			> input {
				flex: 1;
				color: #666;
				font-size: 36rpx;
				font-weight: 500;
				padding: 2px 10px;
				text-align: right;
			}
		}
		.flower {
			background-color: #fff;
			height: 100px;
			display: flex;
			align-items: center;
			justify-content: center;
			> text {
				font-size: 74rpx;
				font-weight: 600;
				color: rgba(128,128,128, .5);
			}
		}
	}
</style>
