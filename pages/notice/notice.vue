<template>
	<view class="tf-page notice-page">
		<tf-loading :loading="loading"></tf-loading>
		
		<!-- 公告列表 -->
		<scroll-view 
			class="list-wrapper"
			:scroll-y="true"
			:lower-threshold="10"
			:refresher-enabled="true"
			:refresher-triggered="trigger"
			:refresher-threshold="60"
			@scrolltolower="reachBottom"
			@refresherrefresh="onRefresh"
		>
			<view class="list-item" v-for="item in list" :key="item._id" @click="toDetail(item._id)">
				<view class="title">{{ item.title }}</view>
				<view class="content">{{ item.content }}</view>
				<view class="images">
					<view class="image" v-for="(img, index) in item.images" :key="img" @click.stop="previewImg(item.images, index)">
						<image :src="img" mode="aspectFill" :lazy-load="true"/>
					</view>
				</view>
				<view class="footer">
					<view class="info">
						<tf-avatar :url="item.avatar" size="mini"></tf-avatar>
						<text class="time">{{ `${item.creator} ${item.date} 发起` }}</text>
					</view>
					<view class="thumb" @click.stop="onLike(item)">
						<text class="tf-icon tf-icon-like" :class="[item.hasLike && 'active']"></text>
						<text class="num">{{ item.thumbs }}</text>
					</view>
				</view>
			</view>
			<view class="finished" v-if="finished && list.length">没有更多数据了</view>
			<u-empty v-if="!list.length" text="暂无公告数据" src="/static/img/no-data.png" :icon-size="240"></u-empty>
		</scroll-view >
		
		<!-- add btn -->
		<view class="add-btn" v-if="isMaster" @click="onAdd">
			<text class="tf-icon tf-icon-plus"></text>
		</view>
		
		<!-- tabbar -->
		<u-tabbar :list="tabbarList" active-color="#7F83BB" inactive-color="#999999" bg-color="#fff"></u-tabbar>
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	import { formatDate } from '../../common/js/utils.js';
	
	const tabbarHeight = 50;
	const systemInfo = uni.getSystemInfoSync();
	const safeBottomHeight = systemInfo.screenHeight - systemInfo.safeArea.bottom;
	const contentHeight = systemInfo.windowHeight - 50 - safeBottomHeight;

	export default {
		data() {
			return {
				list: [],
				loading: true,
				refresh: true,
				finished: false,
				trigger: false,
				scrollTop: 0
			};
		},
		
		computed: {
			isMaster() {
				return this.team.master_id === this.openid;
			},
			...mapState(['team', 'openid', 'userInfo', 'tabbarList'])
		},
		
		watch: {
			'team._id'() {
				this.list = [];
			}
		},
		
		onShow() {
			// 解决图片预览后会调用onshow问题
			if(!this.refresh) {
				this.refresh = true; return;
			}
			this.skip = 0;
			this.finished = false;
			this.loading = true;
			this.loadData();
		},
		
		methods:{
			loadData() {
				return wx.cloud.callFunction({
					name: 'notice',
					data: {
						type: 'get_list',
						params: {
							skip: this.skip,
							team_id: this.team._id
						}
					}
				}).then(({ result }) => {
					if(this.skip === 0) this.list = [];
					this._formatListData(result.data);
					this.loading = false;
					return this.list;
				})
			},
			
			onAdd() {
				uni.navigateTo({
					url: 'notice-create'
				})
			},
			
			onLike(item) {
				item.hasLike = !item.hasLike;
				item.thumbs = item.hasLike ? item.thumbs + 1: item.thumbs - 1;
				// 更新点赞
				this.$u.debounce(() => {
					wx.cloud.callFunction({
						name: 'notice',
						data: {
							type: 'update_likes',
							params: {
								notice_id: item._id,
								openid: this.openid,
								like: !!item.hasLike
							}
						}
					})
				}, 600);
			},
			
			previewImg(images, index) {
				this.refresh = false;
				uni.previewImage({
					urls: images,
					current: index
				})
			},
			
			toDetail(noticeId) {
				const info = {
					notice_id: noticeId,
					master: this.userInfo.nickName,
					team_id: this.team._id,
					team_name: this.team.name
				}
				
				uni.navigateTo({
					url: 'notice-detail?info=' + JSON.stringify(info)
				})
			},
			
			// 上拉加载更多
			reachBottom() {
				if(this.finished || this.loading) return;
				this.loading = true;
				this.loadData();
			},
			
			// 下拉刷新
			onRefresh() {
				this.trigger = true;
				this.skip = 0;
				this.finished = false;
				this.loadData().then(() => this.trigger = false);
			},
			
			_formatListData(list) {
				list.forEach(item => {
					item.images = item.images.slice(0, 3);
					item.thumbs = item.likes.length;
					item.hasLike = item.likes.findIndex(openid => this.openid === openid) !== -1;
					item.date = formatDate('yyyy-MM-dd hh:mm', new Date(item.date));
				});
				
				this.list = this.list.concat(list);
				this.skip += list.length;
				if(list.length < 6) {
					this.finished = true;
				}
			}
		}
	}
</script>

<style lang="scss">
	
.notice-page {
	background-color: #fff;
	height: calc(100% - 50px - env(safe-area-inset-bottom));
}

.list-wrapper{
	height: 100%;
	.list-item {
		padding: 10px 16px;
		.title {
			font-size: 32rpx;
			font-weight: bold;
			color: $font-color;
			margin-bottom: 10px;
		}
		.content {
			font-size: 28rpx;
			color: $font-color-light-1;
			margin-bottom: 8px;
			display: -webkit-box;    
			-webkit-box-orient: vertical;    
			-webkit-line-clamp: 2;    
			overflow: hidden;
		}
		.images {
			display: flex;
			margin-bottom: 8px;
			.image {
				width: 80px;
				height: 80px;
				margin: 0px 8px 8px 0px;
				overflow: hidden;
				position: relative;
				border-radius: 8rpx;
				image {
					width: 100%;
					height: 100%;
				}
			}
		}
		.footer {
			display: flex;
			align-items: center;
			color: $font-color-light-1;
			.info {
				flex: 1;
				display: flex;
				align-items: center;
				color: #ccc;
				
				.time {
					margin-left: 8px;
					font-size: 26rpx;
				}
			}
			.thumb {
				flex: 0 0 auto;
				.tf-icon.active {
					color: $color-primary;
				}
				.num {
					margin-left: 6px;
				}
			}
		}
		&:not(:first-child) {
			border-top: 1px solid #eee;
		}
	}
	.finished {
		padding: 10px;
		text-align: center;
		font-size: 26rpx;
		color: #999;
	}
}
	
.add-btn {
	width: 40px;
	height: 40px;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: $color-primary;
	position: fixed;
	right: 10px;
	bottom: calc(60px + env(safe-area-inset-bottom));
	.tf-icon {
		color: #fff;
		font-size: 40rpx;
	}
}
</style>
