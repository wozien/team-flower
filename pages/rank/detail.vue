<template>
	<view class="rank-detail">
		<tf-layout :mg-top="60" @scroll-lower="toScrollLower">
			<view class="member" slot="header">
				<tf-avatar :url="member.avatar" class="avatar" size="large"></tf-avatar>
				<view class="name-and-rank">
					<text class="name">{{ member.nickname }}</text>
					<text class="rank">第 {{ member.order || '' }} 名</text>
				</view>
				<view class="flower">
					<text class="number">{{ member.flowers }}</text>
					<image src="../../static/img/flower.png"></image>
				</view>
			</view>
			<!-- history list -->
			<view class="list">
				<view class="list-item" v-for="item in history" :key="item._id">
					<view class="date">
						<text class="year" v-if="!item.last">{{ item.date.year }}</text>
						<text class="day" v-if="!item.last">{{ `${item.date.month}/${item.date.day}` }}</text>
						<view class="dot"></view>
					</view>
					<view class="record" v-if="!item.last">
						<text class="number" :class="{'number-add': item.add}">
							{{ (item.add ? '+ ' : '- ') + item.number }}
						</text>
						<view class="message">
							<tf-icon icon="quote-left" style="color: #9b9b9b" :size="12"></tf-icon>
							<text>{{ item.message }}</text>
							<tf-icon icon="quote-right" style="margin-left: 4px;color: #9b9b9b;" :size="12"></tf-icon>
							<view class="from">
								<text>{{ item.from.nickname }}</text>
								<tf-avatar :url="item.from.avatar" size="small" style="margin-left: 6px;"></tf-avatar>
							</view>
						</view>
					</view>
					<view class="last" v-else>
						嘿，这是我的底线～
					</view>
				</view>
			</view>
			
			<view class="footer" slot="footer">
				<tf-button v-if="isMaster && !isSelf" :width="125" size="small" icon="close" type="primary"
				 style="margin-right: 16px;" @click="updateFlower(false)">扣除</tf-button>
				<tf-button v-if="isSelf" :width="125" size="small" icon="update" @click="rename" type="primary">修改昵称</tf-button>
				<tf-button v-else :width="125" size="small" icon="aixin" type="assia" @click="updateFlower(true)">感谢</tf-button>
			</view>
		</tf-layout>
	</view>
</template>

<script>
	import TfLayout from '@/components/tf/tf-layout.vue';
	import { mapState, mapMutations} from 'vuex';
	import { getTeam } from '../../common/js/db.js';
	
	export default {
		components:{
			TfLayout
		},
		
		data() {
			return {
				history: [],
				member: {},
				detail_id:''
			}
		},
		
		computed: {
			isSelf() {
				return this.member.openid === this.openid;
			},
			isMaster() {
				return this.team.master_id === this.openid;
			},
			...mapState(['team', 'openid'])
		},
		
		created() {
			uni.$on('rename', (name) => {
				this.member.nickname = name;
			});
			uni.$on('inc-flower', inc => {
				this.member.flowers += inc;
			});
		},
		
		onLoad({detail_id}) {
			this.detail_id = detail_id;
			this.member = this.team.members.find(mb => mb.openid === detail_id);
			this.scrollTimer = null;   // 防抖处理
		},
		
		onShow() {
			this.skip = 0;
			this.loadHistory();
		},
		
		onPullDownRefresh() {
			this.skip = 0;
			let prom1 = this.loadHistory();
			let prom2 = getTeam(this.team._id).then(res => {
				this.calcOrder(res.data);
			});
			Promise.all([prom1, prom2]).then(() => {
				uni.stopPullDownRefresh();
			});
		},
		
		methods: {
			loadHistory() {
				// 获取流水记录 TODO 分页处理
				return wx.cloud.callFunction({
					name: 'history',
					data: {
						type: 'get_list',
						params: {
							team_id: this.team._id,
							to: this.detail_id,
							skip: this.skip || 0
						}
					}
				}).then(({ result }) => {
					if(this.skip === 0) this.history = [];
					this.formatHistory(result.data || []);
				});
			},
			
			calcOrder(team) {
				const members = team.members.filter(mb => mb);
				members.sort((a,b) => b.flowers - a.flowers);
				members.forEach((member, index) => {
					member.order = index + 1;
					member.flowers = +member.flowers;
					member.key = member.openid + member.order;        // 这里需要重新计算列表渲染的key
				});
				this.member = members.find(mb => mb.openid === this.detail_id);
				team.members = members;
				this.setTeam(team);
			},
			
			padZero(num) {
				return (num + '').padStart(2, '0');
			},
			
			formatWeek(date) {
				const week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
				return week[+date.getDay()];
			},
			
			formatDate(date) {
				let year = date.getFullYear()
				const month = this.padZero(date.getMonth() + 1);
				let day = date.getDate();
				
				const today = (new Date()).getDate();
				if(today - day < 7) {
					year = this.formatWeek(date);
					year = today - day === 0 ? '今天' : year;
				} 
				day = this.padZero(day);
				
				return { year, month, day };
			},
			
			formatHistory(data) {
				data.forEach(item => {
					item.from = this.team.members.find(mb => mb.openid === item.from);
					item.date = this.formatDate(new Date(item.date));
				})
				
				if(data.length) {
					this.skip += data.length;
					this.history = this.history.concat(data);
				}
				
				const index = this.history.findIndex(item => item.last);
				if(index < 0 && data.length < 10) {
					// 没有多余数据
					this.history.push({ last: true });
				}
			},
			
			updateFlower(add) {
				const info = {
					add,
					to: {
						openid: this.member.openid,
						nickname: this.member.nickname
					}
				}
				uni.navigateTo({
					url:"../give/give?info=" + JSON.stringify(info)
				});
			},
			
			rename() {
				uni.navigateTo({
					url: '../rename/rename'
				});
			},
			
			toScrollLower() {
				if(this.scrollTimer) clearTimeout(this.scrollTimer);
				this.scrollTimer = setTimeout(() => {
					const index = this.history.findIndex(item => item.last);
					if(index > -1) return;
					this.loadHistory();
				}, 600);
			},
			
			...mapMutations({
				setTeam: 'SET_TEAM'
			})
		}
	}
</script>

<style lang="scss">
	.rank-detail {
		height: 100%;
		.member {
			display: flex;
			align-items: center;
			margin-top: 20px;
			padding: 0 30px;
			.avatar {
				margin-right: 10px;
				flex: 0 0 auto;
			}
			.name-and-rank {
				flex: 1;
				display: flex;
				flex-direction: column;
				.name {
					color: #fff;
					font-size: 36rpx;
					font-weight: 600;
				}
				.rank {
					color: $color-primary;
					font-size: 26rpx;
					margin-top: 6px;
				}
			}
			.flower {
				flex: 0 0 auto;
				background-color: #f0f0f0;
				border-radius: 20px;
				display: flex;
				align-items: center;
				padding: 6px 14px;
				.number {
					font-size: 36rpx;
					color: #FF6600;
					font-weight: 600;
					margin-right: 6px;
				}
				>image {
					width: 25px;
					height: 25px;
				}
			}
		}
		
		.list{
			padding: 14px 0px;
			.list-item {
				display: flex;
				padding: 0 15px 0 20px;
				.date {
					position: relative;
					flex: 0 0 65px;
					color: #999;
					border-right: 4px solid #7F83BB;
					display: flex;
					flex-direction: column;
					.year {
						font-size: 28rpx;
					}
					.day {
						font-size: 26rpx;
					}
					.dot {
						width: 16px;
						height: 16px;
						background-color: #fff;
						border: 4px solid #7F83BB;
						position: absolute;
						right: -10px;
						top: 0px;
						border-radius: 50%;
					}
				}
				.record {
					flex: 1;
					overflow: hidden;
					padding: 0px 14px;
					.number {
						font-size: 36rpx;
						font-weight: bold;
						color: #1AAD19;
						&.number-add {
							color: #FF6600;
						}
					}
					.message {
						position: relative;
						background-color: #f0f0f0;
						border-radius: 14px;
						padding: 12px;
						margin: 6px 0px 14px 0px;
						font-size: 26rpx;
						color: #666;
						padding-bottom: 20px;
						.from{
							position: absolute;
							right: -2px;
							bottom: -6px;
							display: flex;
							align-items: center;
							color: #999;
							font-size: 26rpx;
						}
					}
				}
				.last {
					color: #666;
					font-size: 24rpx;
					padding-left: 14px;
				}
			}
		}
		
		.footer {
			padding-top: 6px;
			display: flex;
			justify-content: center;
		}
	}
</style>
