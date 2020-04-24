<template>
	<view class="give-page">
		<view class="number">
			<text>{{ desc }}</text>
			<input type="number" v-model="number" placeholder="0.0" :focus="true" />
		</view>
		<view class="message">
			<textarea placeholder="感谢你的辛勤付出~" v-model="message" :focus="true" placeholder-style="color: #ccc"/>
		</view>
		<view class="flower">
			<tf-icon icon="flower-plain" :size="34" style="color: #ccc"></tf-icon>
			<text>{{ number }}</text>
		</view>
		
		<tf-button :type="add ? 'assia' : 'primary'" :width="200" @click="onClickBtn">{{ desc + '小红花'}}</tf-button>
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	import { getCollection, command as _ } from '../../common/js/db.js';
	import { version } from '@/common/js/config.js';
	
	export default {
		data() {
			return {
				add: true,
				to: {},
				number: '',
				message: ''
			}
		},
		
		computed: {
			desc() {
				return this.add ? '赠送' : '扣除';
			},
			...mapState(['openid', 'team'])
		},
		
		onLoad({info}) {
			info = JSON.parse(info);
			this.add = info.add;
			this.to = info.to;	
		},
		
		onShow() {
			const title = (this.add ? '感谢' : '扣除') + this.to.nickname;
			uni.setNavigationBarTitle({ title });
		},
		
		methods: {
			give() {
				const members = this.team.members.slice(0);
				const my = members.find(mb => mb.openid === this.openid);
				const isMaster = this.team.master_id === this.openid;
				const number = +this.number;
				let errorMsg;
				
				if(number <= 0) {
					errorMsg = '请输入大于0的红花数量';
				} else if(!this.add && !this.message) {
					errorMsg = '请输入扣除原因';
				} else if(!isMaster && my.quota < number) {
					errorMsg = '您的小红花额度不足哦~';
				}
				
				if(errorMsg) {
					// 花额度不够
					uni.showToast({
						title: errorMsg,
						icon: "none"
					});
					return;
				}
				
				const message = this.message || '感谢你的辛勤付出~';
				
				// 修改被赠者花的数量
				const inc = this.add ? +this.number : -this.number;
				const prom1 = wx.cloud.callFunction({
					name: 'team',
					data: {
						type: 'update_flowers',
						params: {
							team_id: this.team._id,
							openid: this.to.openid,
							inc
						}
					}
				});
				
				// 修改赠送者的积分
				let prom2 = Promise.resolve();
				if(!isMaster && this.add) {
					prom2 = wx.cloud.callFunction({
						name: 'team',
						data: {
							type: 'update_quota',
							params: {
								team_id: this.team._id,
								openid: this.openid,
								inc: -inc
							}
						}
					});
				}
				
				// 增加流水记录
				const historySet = getCollection('history');
				const data = {
					team_id: this.team._id,
					from: this.openid,
					to: this.to.openid,
					number,
					message,
					add: this.add,
					date: new Date(),
					version: version
				}
				const prom3 = historySet.add({ data });
				
				Promise.all([prom1, prom2, prom3]).then(() => {
					// 订阅消息推送
					wx.cloud.callFunction({
						name: 'notification',
						data: {
							type: this.add ? 'give': 'deduct',
							params: {
								team_id: this.team._id,
								team_name: this.team.name,
								touser: this.to.openid,
								sender: my.nickname,
								number,
								reason: message
							}
						}
					});
					uni.$emit('inc-flower', inc);
					uni.navigateBack({});
				}).catch(e => {
					console.warn('赠送失败：' + e.message); 
				})
			},
			
			onClickBtn() {
				const content = `确定${this.desc+this.to.nickname + this.number}朵小红花?`;
				uni.showModal({
					content,
					success: res => {
						if(res.confirm) {
							this.give();
						}
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	.give-page{
		height: 100%;
		background-color: #fff;
		padding: 0 14px;
		overflow: hidden;
		>view {
			background-color: #f1f1f1;
			border-radius: 4px;
			&.number {
				padding: 10px;
				display: flex;
				margin-top: 16px;
				align-items: center;
				> text {
					flex: 0 0 30px;
					font-size: 26rpx;
					color: #666;
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
			&.message {
				margin-top: 10px;
				padding: 14px;
				>textarea {
					width: 100%;
					height: 50px;
					font-size: 26rpx;
					color: #999;
				}
			}
			&.flower {
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
	}
</style>
