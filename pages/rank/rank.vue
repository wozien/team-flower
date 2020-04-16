<template>
	<view class="rank-page">
		<view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
		<view class="menu" slot="left">
			<tf-icon icon="menu" @click="visible=true"></tf-icon>
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
						:class="{'list-item-first': !index}"
						v-for="(member,index) in members" 
						:key="member.openid"
						@click="toDetail(member.openid)">
						<view class="order">
							<image v-if="index < 3" :src="`../../static/img/no${index + 1}.png`"></image>
							<text v-else>{{ member.order }}</text>
						</view>
						<tf-avatar class="avatar" :url="member.avatar"></tf-avatar>
						<text class="name">{{ member.nickname }}</text>
						<text class="number" :class="{'hlight': index < 3}">{{ member.flowers }}</text>
					</view>
				</view>
				<view slot="footer" class="footer">
					<tf-button type="primary" size="small" :width="200">邀请好友加入</tf-button>
				</view>
			</tf-layout>
		</view>
		
		<!-- 侧栏 -->
		<uni-drawer :visible="visible" @close="visible=false">
			<view :style="{ marginTop: statusBarHeight + 'px' }">侧栏</view>
		</uni-drawer>
	</view>
</template>

<script>
	import TfLayout from '@/components/tf/tf-layout.vue';
	import uniDrawer from "@/components/uni-drawer/uni-drawer.vue"
	import { mapState, mapMutations } from 'vuex';
	import { getTeam } from '@/common/js/db.js';
	
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
				visible: false,
				statusBarHeight: statusBarHeight,
				contentHeight: contentHeight
			}
		},
		
		computed:{
			members() {
				return this.team.members || [];
			},
			isMaster() {
				return this.team.master_id === this.openid;
			},
			...mapState(['team', 'teams', 'openid'])
		},
		
		onLoad({team_id}) {
			getTeam(team_id).then(res => {
				if(res.errMsg === 'document.get:ok') {
					this.calcOrder(res.data);
				}
			})
		},
		
		methods: {
			calcOrder(team) {
				const {members} = team;
				members.sort((a,b) => b.flowers - a.flowers);
				members.forEach((member, index) => {
					member.order = index + 1;
					members.flowers = +members.flowers;
				})
				this.my = members.find(item => item.openid === this.openid)
				this.setTeam(team);
				// 存储当前团队id
				uni.setStorageSync('TEAM_ID', team._id);
			},
			toDetail(openid) {
				uni.hideHomeButton()
				uni.navigateTo({
					url: './detail?detail_id=' + openid
				})
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
	}
</style>
