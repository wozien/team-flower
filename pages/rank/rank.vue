<template>
	<view class="rank-page">
		<view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
		<view class="menu" slot="left" @click="visible=true">
			<tf-icon icon="menu"></tf-icon>
			<text class="name">{{ team.name }}</text>
			<u-tag v-if="isHelpMode" text="互助" shape="circle" bg-color="#7F83BB" color="#fff" border-color="#fff" size="mini"></u-tag>
			<u-tag v-else text="管控" shape="circle" bg-color="#7F83BB" color="#fff" border-color="#fff" size="mini"></u-tag>
		</view>
		<view class="content" :style="{ height: contentHeight + 'px' }">
			<tf-layout :height="contentHeight" :show-footer="false">
				<view slot="header" class="header">
					<view class="info">
						<tf-avatar :url="my.avatar" class="avatar" @click.native="toDetail(my.openid)"></tf-avatar>
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
						<input type="text" placeholder="搜索" v-model="query" placeholder-style="color: #cccccc"/>
						<view class="search-icon">
							<tf-icon icon="search" :size="22"></tf-icon>
						</view>
					</view>
				</view>
				
				<!-- 排名列表 -->
				<tf-list :members="queryMembers" :is-master="isMaster" @delete="delItem"></tf-list>
			</tf-layout>
		</view>
		
		<!-- 侧栏 -->
		<uni-drawer :visible="visible" @close="visible=false" class="drawer">
			<view class="profile" :style="{ marginTop: statusBarHeight + 'px' }">
				<tf-avatar :url="my.avatar" class="avatar" />
				<view class="name-and-quota">
					<text class="name">{{ my.nickname }}</text>
					<view class="quota">
						小红花余额: <text>{{ isMaster ? 9999 +'+' : my.quota }}</text>
					</view>
				</view>
			</view>
			<text class="teams-label">已加入团队</text>
			<scroll-view scroll-y="true" :style="{height: teamsScrollHeight + 'px'}">
				<view class="team-list">
					<view class="team-list-item"
						:class="{'current': item.id === team._id}"
						v-for="(item, index) in teams"
						:key="item.id"
						@click="switchTeam(item.id, index)">
						{{ item.name }}
					</view>
				</view>
			</scroll-view>
			<!-- <tf-button v-if="isMaster" type="primary" :width="140" size="small" @click="setQuota">设置小红花额度</tf-button> -->
			<tf-button v-if="isMaster" type="primary"  :width="140" size="small" open-type="share">邀请好友加入</tf-button>
			<tf-button :width="140" size="small" @click="createTeam">创建新团队</tf-button>
		</uni-drawer>
		
		<!-- tabbar -->
		<u-tabbar :list="tabbarList" active-color="#7F83BB" inactive-color="#999999" bg-color="#fff"></u-tabbar>
	</view>
</template>

<script>
	import TfLayout from '@/components/tf/tf-layout.vue';
	import TfList from '../../components/tf/tf-list.vue';
	import { mapState, mapMutations } from 'vuex';
	import { getTeam, getMyTeams, getCollection } from '@/common/js/db.js';
	
	const menuHeight = 40;
	const tabbarHeight = 50;
	const systemInfo = uni.getSystemInfoSync();
	const statusBarHeight = systemInfo.statusBarHeight;
	const safeBottomHeight = systemInfo.screenHeight - systemInfo.safeArea.bottom;
	const contentHeight = systemInfo.screenHeight - statusBarHeight - menuHeight - tabbarHeight - safeBottomHeight;
	
	export default {
		components: {
			TfLayout,
			TfList
		},
		
		data() {
			return {
				my: {},
				members: [],
				teams: [],
				team_id: '',
				visible: false,
				statusBarHeight: statusBarHeight,
				contentHeight: contentHeight,
				query: ''
			}
		},
		
		computed:{
			queryMembers() {
				let res = this.members;
				if(this.query) {
					res = res.filter(mb => mb.nickname.indexOf(this.query) > -1);
				} 
				return res;
			},
			isMaster() {
				return this.team.master_id === this.openid;
			},
			teamsScrollHeight() {
				let res = systemInfo.screenHeight - 190 - statusBarHeight;
				if(!this.isMaster) {
					res += 46;
				}
				return res;
			},
			isHelpMode() {
				return !this.team.mode || this.team.mode === 'HELP';
			},
			...mapState(['team', 'openid', 'userInfo', 'tabbarList'])
		},
		
		watch: {
			team_id(val) {
				// 存储当前团队id
				uni.setStorageSync('TEAM_ID', val);
			}
		},
		
		onLoad() {
			
			if(!this.openid) {
				// 用户首次进入小程序，跳转slogan页面
				uni.navigateTo({
					url: '../index/index'
				})
				return;
			}
			
			uni.getSetting({
				success: res => {
					if(res.authSetting['scope.userInfo']) {
						uni.getUserInfo({
							success: res => {
								this.setUserInfo(res.userInfo);
							}
						})
					} else {
						// 用户未授权
						uni.navigateTo({
							url: '../auth/auth'
						})
					}
				}
			})
		},
				
		onShow() {
			if(!this.openid) return;
			this.team_id = uni.getStorageSync('TEAM_ID');
			getMyTeams(this.openid).then(res => {
				this.teams = res || [];
				if(this.teams.length) {
					// 在被移除团队后默认显示我的团队列表第一个
					const index = this.teams.findIndex(team => team.id === this.team_id);
					if(!this.team_id || index < 0) {
						this.team_id = this.teams[0].id;
					}
					this.setTeams(this.teams);
					this.loadTeam();
				} else {
					uni.redirectTo({
						url: '../create/create'
					});
				}
			});
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
			getMyTeams(this.openid).then(res => {
				uni.stopPullDownRefresh();
				this.teams = res || [];
				if(this.teams.length) {
					// 在被移除团队后默认显示我的团队列表第一个
					const index = this.teams.findIndex(team => team.id === this.team_id);
					if(!this.team_id || index < 0) {
						this.team_id = this.teams[0].id;
					}
					this.setTeams(this.teams);
					this.loadTeam();
				} else {
					uni.redirectTo({
						url: '../create/create'
					});
				}
			});
		},
		
		methods: {
			loadTeam() {
				return getTeam(this.team_id).then(res => {
					this.setMembers(res.data);
					this.setTeam(res.data);
				});
			},
			
			// 计算排名
			setMembers(team) {
				const members  = team.members.filter(mb => mb.is_delete == 0);
				members.sort((a,b) => b.flowers - a.flowers);
				members.forEach((member, index) => {
					member.order = index + 1;
					member.flowers = +member.flowers;
					member.key = member.openid + member.order;        // 这里需要重新计算列表渲染的key
				})
				this.members = members;
				this.my = members.find(item => item.openid === this.openid)
			},
			
			toDetail(detail_id) {
				uni.navigateTo({
					url: './detail?detail_id=' + detail_id
				});
			},
			
			switchTeam(team_id, index) {
				this.team_id = team_id;
				this.loadTeam().then(() => {
					this.visible = false;
					const data = this.teams.splice(index, 1);
					this.teams.unshift(data[0]);
				});
			},
			
			createTeam() {
				uni.navigateTo({
					url: '../create/create',
					success: () => {
						this.hideDrawer();
					}
				});
			},
			
			hideDrawer() {
				setTimeout(() => {
					this.visible = false;
				}, 0);
			},
			
			delItem(item) {
				const content = `确定移除成员${item.nickname}吗?`;
				uni.showModal({
					content,
					success: res => {
						if(res.confirm) {
							this.removeMember(item.openid)
						}
					}
				});
			},
			
			removeMember(openid) {
				if(this.openid === openid) {
					this.$toast('无法移除自己');
					return;
				}
				
				// 移除成员
				let p1 = wx.cloud.callFunction({
					name: 'team',
					data: {
						type: 'remove_member',
						params: {
							team_id: this.team._id,
							openid
						}
					}
				});
				// 移除历史记录
				let p2 = wx.cloud.callFunction({
					name: 'history',
					data: {
						type: 'remove_history',
						params: {
							team_id: this.team._id,
							to: openid
						}
					}
				});
				
				Promise.all([p1, p2]).then(res => {
					this.$toast('移除成功', 'success');
					const index = this.members.findIndex(mb => mb.openid === openid);
					if(index > -1) {
						this.members.splice(index, 1);
					}
				});
			},
			
			/**
			 * 小程序审核hack代码，根据后台配置动态显示公告的tab
			 */
			_setTarbar() {
				const configCollection = getCollection('config');
				configCollection.doc('28ee4e3e601031110129bcf56a6d81ac').get().then(({ data }) => {
					if(data.notice) {
						this.addNoticeTab();
					}
				})
			},
			
			...mapMutations({
				setTeam: 'SET_TEAM',
				setTeams: 'SET_MY_TEAMS',
				setUserInfo: 'SET_USERINFO',
				addNoticeTab: 'ADD_NOTICE_TAB'
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
			padding-left: 8px;
			display: flex;
			align-items: center;
			.name {
				margin-right: 8px;
			}
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
					position: relative;
					&.current {
						color: $color-primary;
						border-color: $color-primary;
						&::before {
							content: "";
							display: block;
							position: absolute;
							width: 12px;
							height: 10px;
							top: 0px;
							right: 18px;
							background-color: $color-primary;
						}
						&::after {
							content: "";
							display: block;
							position: absolute;
							width: 0px;
							height: 0px;
							top: 10px;
							right: 18px;
							border: 6px solid transparent;
							border-top-color: $color-primary;
						}
					}
				}
			}
		}
	}
</style>
