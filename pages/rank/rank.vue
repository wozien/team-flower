<template>
	<view class="rank-page">
		<view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
		<view class="menu" slot="left" @click="visible=true">
			<tf-icon icon="menu"></tf-icon>
			<text>{{ team.name }}</text>
		</view>
		<view class="content" :style="{ height: contentHeight + 'px' }">
			<tf-layout :height="contentHeight" :show-footer="isMaster">
				<view slot="header" class="header">
					<view class="info">
						<tf-avatar :url="my.avatar" class="avatar"></tf-avatar>
						<view class="name-and-rank" @click="toDetail(my.openid)">
							<text class="name">{{ my.nickname }}</text>
							<text class="rank">第 {{ my.order || '' }} 名</text>
						</view>
						<view class="flower">
							<text>{{ my.flowers }}</text>
							<image src="../../static/img/flower.png"></image>
						</view>
					</view>
					<view class="search">
						<input type="text" placeholder="搜索" placeholder-style="color: #cccccc"/>
						<view class="search-icon">
							<tf-icon icon="search" :size="22"></tf-icon>
						</view>
					</view>
				</view>
				<view class="list">
					<view 
						class="list-item"
						:class="{'list-item-first': member.order === 1}"
						v-for="(member,index) in members" 
						:key="member.key"
						@click="toDetail(member.openid)">
						<view class="order">
							<image v-if="index < 3" :src="`../../static/img/no${member.order}.png`"></image>
							<text v-else>{{ member.order }}</text>
						</view>
						<tf-avatar class="avatar" :url="member.avatar"></tf-avatar>
						<text class="name">{{ member.nickname }}</text>
						<text class="number" :class="{'hlight': index < 3}">{{ member.flowers }}</text>
					</view>
				</view>
				<view slot="footer" class="footer">
					<tf-button type="primary" size="small" :width="200" open-type="share">邀请好友加入</tf-button>
				</view>
			</tf-layout>
		</view>
		
		<!-- 侧栏 -->
		<uni-drawer :visible="visible" @close="visible=false" class="drawer">
			<view class="profile" :style="{ marginTop: statusBarHeight + 'px' }">
				<tf-avatar :url="userInfo.avatarUrl" class="avatar" />
				<view class="name-and-quota">
					<text class="name">{{ userInfo.nickName }}</text>
					<view class="quota">
						小红花余额: <text>{{ isMaster ? 999 +'+' : my.quota }}</text>
					</view>
				</view>
			</view>
			<text class="teams-label">已加入团队</text>
			<scroll-view scroll-y="true" :style="{height: teamsScrollHeight + 'px'}">
				<view class="team-list">
					<view class="team-list-item"
						:class="{'current': item.id === team._id}"
						v-for="item in teams"
						:key="item.id"
						@click="switchTeam(item.id)">
						{{ item.name }}
					</view>
				</view>
			</scroll-view>
			<tf-button v-if="isMaster" type="primary" :width="140" size="small">设置小红花额度</tf-button>
			<tf-button :width="140" size="small" @click="createTeam">创建新团队</tf-button>
		</uni-drawer>
		
	</view>
</template>

<script>
	import TfLayout from '@/components/tf/tf-layout.vue';
	import uniDrawer from "@/components/uni-drawer/uni-drawer.vue"
	import { mapState, mapMutations } from 'vuex';
	import { getTeam, getMyTeams } from '@/common/js/db.js';
	
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
				my: {},
				teams: [],
				visible: false,
				statusBarHeight: statusBarHeight,
				contentHeight: contentHeight
			}
		},
		
		computed:{
			members() {
				console.log(this.team.members)
				return this.team.members || [];
			},
			isMaster() {
				// return this.team.master_id === this.openid;
				return true;
			},
			teamsScrollHeight() {
				let res = systemInfo.screenHeight - 190 -statusBarHeight;
				if(!this.isMaster) {
					res += 60;
				}
				return res;
			},
			...mapState(['team', 'openid', 'userInfo'])
		},
		
		onLoad({team_id}) {
			this.team_id = team_id;
			// 存储当前团队id
			uni.setStorageSync('TEAM_ID', team_id);
		},
		
		onShow() {
			this.loadTeam();
		},
		
		onShareAppMessage() {
			const info = {
				team_id: this.team._id,
				team_name: this.team.name,
				master: this.my.nickname,
			}
			return {
				title: this.my.nickname + '邀请你加入' + this.team.name,
				imageUrl: '../../static/img/invite.png',
				path: '/pages/invite/invite?info=' + JSON.stringify(info)
			}
		},
		
		onPullDownRefresh() {
			this.loadTeam().then(() => {
				uni.stopPullDownRefresh();
			});
		},
		
		methods: {
			loadTeam() {
				// 请求我的团队
				let prom1 = getMyTeams(this.openid).then(res => this.teams = res);
				// 加入团队详情
				let prom2 = getTeam(this.team_id).then(res => {
					this.calcOrder(res.data);
				});
				return Promise.all([prom1, prom2]);
			},
			
			calcOrder(team) {
				const {members} = team;
				members.sort((a,b) => b.flowers - a.flowers);
				members.forEach((member, index) => {
					member.order = index + 1;
					member.flowers = +member.flowers;
					member.key = member.openid + member.order;        // 这里需要重新计算列表渲染的key
				})
				this.my = members.find(item => item.openid === this.openid)
				this.setTeam(team);
			},
			
			toDetail(detail_id) {
				uni.navigateTo({
					url: './detail?detail_id=' + detail_id
				});
			},
			
			switchTeam(team_id) {
				console.log(team_id)
			},
			
			createTeam() {
				uni.navigateTo({
					url: '../index/index?is_create=1'
				});
			},
			
			...mapMutations({
				setTeam: 'SET_TEAM'
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
			.header {
				.info {
					display: flex;
					align-items: center;
					color: #fff;
					padding: 20px 35px;
					padding-bottom: 0px;

					.avatar{
						flex: 0 0 auto;
						margin-right: 18px;
					}
					.name-and-rank {
						flex: 1;
						display: flex;
						flex-direction: column;
						.name {
							font-size: 32rpx;
							font-weight: 500;
						}
						.rank {
							opacity: .6;
							font-size: 26rpx;
						}
					}
					.flower {
						flex: 0 0 auto;
						display: flex;
						align-items: center;
						> text {
							font-size: 36rpx;
							font-weight: bold;
							margin-right: 6px;
						}
						> image {
							width: 25px;
							height: 25px;
						}
					}
				}
				.search {
					display: flex;
					background-color: #f0f0f0;
					height: 45px;
					border-radius: 30px;
					margin:12px 30px;
					align-items: center;

					> input {
						flex: 1;
						color: #666;
						padding-left: 20px;
					}
					.search-icon {
						flex: 0 0 auto;
						border-radius: 50%;
						background-color: $color-primary;
						color: #fff;
						width: 32px;
						height: 32px;
						margin-right: 8px;
						text-align: right;
						line-height: 35px;
					}
				}
			}
			
			.list {
				.list-item {
					height: 75px;
					display: flex;
					align-items: center;
					border-top: 1px solid #eee;
					margin: 0px 30px 0px 15px;
					&.list-item-first { border-top: none}
					.order{
						flex: 0 0 50px;
						text-align: center;
						> image {
							height: 30px;
							width: 30px;
						}
						>text{
							font-weight: 600;
						}
					}
					.avatar {
						flex: 0 0 auto;
						margin-right: 10px;
					}
					.number {
						flex: 0 0 auto;
						color: #1aad19;
						font-weight: 600;
						font-size: 36rpx;
						&.hlight {
							color: #ff6600
						}
					}
					.name {
						flex: 1;
						color: #666;
					}
				}
			}
			.footer{
				padding-top: 6px;
			}
		}
		
		.drawer {
			.profile {
				display: flex;
				align-items: center;
				padding: 10px 12px;
				.avatar {
					flex: 0 0 auto;
					margin-right: 10px;
				}
				.name-and-quota {
					flex: 1;
					display:  flex;
					flex-direction: column;
					color: #666;
					.name {
						font-size: 32rpx;
						font-weight: 600;
					}
					.quota {
						font-size: 26rpx;
						margin-top: 4px;
						> text {
							color: #FF6600;
							font-weight: 600;
							margin-left: 10px;
						}
					}
				}
			}
			.teams-label {
				color: #999;
				font-size: 26rpx;
				padding: 6px 12px;
			}
			
			/deep/ .tf-button {
				margin-bottom: 10px;
			}
			
			.team-list {
				padding: 10px;
				.team-list-item {
					padding: 8px;
					text-align: center;
					font-size: 26rpx;
					border-radius: 6px;
					border: 1px solid #eee;
					color: #666;
					margin-bottom: 10px;
					&.current {
						color: $color-primary;
						border-color: $color-primary;
					}
				}
			}
		}
	}
</style>
