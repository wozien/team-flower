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
		
		<tf-button :type="add ? 'assia' : 'primary'" :width="200" @click.native="onClickBtn">{{ desc + '小红花'}}</tf-button>
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	import { getCollection } from '../../common/js/db.js';
	
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
		
		onLoad({item}) {
			item = JSON.parse(decodeURIComponent(item))
			this.add = item.add;
			this.to = item.to;	
			const title = (this.add ? '感谢' : '扣除') + this.to.nickname;
			uni.setNavigationBarTitle({
				title
			})
		},
		
		methods: {
			give() {
				const members = this.team.members.slice(0);
				const my = members.find(mb => mb.openid === this.openid);
				const isMaster = this.team.master_id === this.openid;
				
				if(!isMaster && my.flowers < this.number) {
					// 自己的花小于赠送的
					uni.showToast({
						title: '你没有多余的花可以赠送哦～',
						icon: "none"
					})
				}
				
				// 修改花的数量
				const to = members.find(mb => mb.openid === this.to.openid);
				if(this.add) {
					to.flowers += +this.number;
					!isMaster && (my.flowers -= +this.number);
				} else {
					to.flowers -= +this.number;
				}
				
				const teamSet = getCollection('team');
				const prom1 = teamSet.doc(this.team._id).update({
					data: { members }
				});
				
				// 增加流水记录
				const data = {
					team_id: this.team._id,
					from: this.openid,
					to: this.to.openid,
					number: this.number,
					message: this.message,
					add: this.add,
					date: new Date()
				}
				const historySet = getCollection('history');
				const prom2 = historySet.add({ data });
				
				Promise.all([prom1, prom2]).then(([res]) => {
					uni.$emit('rank-detail-reload');
					uni.showToast({
						title: this.desc + '成功',
						success() {
							uni.navigateBack({});
						}
					});
				}).catch(e => {
					console.warn('失败：' + e.message);
				})
			},
			
			onClickBtn() {
				const content = `确定${this.desc+this.to.nickname}朵小红花?`;
				uni.showModal({
					content,
					success: res => {
						if(res.confirm) {
							this.give();
						}
					}
				})
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
			padding: 10px;
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
