<template>
	<scroll-view  :scroll-y="true" class="tf-page notice-detail-page">
		<tf-loading :loading="loading"></tf-loading>
		<view v-if="!loading" class="main">
			<view class="title">{{ notice.title }}</view>
			<view class="info">
				<tf-avatar :url="notice.avatar" size="mini"></tf-avatar>
				<text class="time">{{ `${notice.creator} ${notice.date} 发起` }}</text>
				<text class="edit-btn" v-if="isMaster" @click="onEdit">编辑</text>
			</view>
			<view class="content">
				{{ notice.content }}
			</view>
			<view class="images">
				<view class="image" v-for="img in notice.images" :key="img">
					<image :src="img" mode="widthFix" :lazy-load="true"></image>
				</view>
			</view>
			<view class="btns">
				<tf-button type="primary" icon="like" :width="120" size="small" @click="toggleLike">{{ notice.hasLike ? '取消' : '点赞' }} {{ notice.thumbs }}</tf-button>
				<tf-button type="primary" icon="share" plain :width="120" size="small" open-type="share">分享到群里</tf-button>
			</view>
		</view>
	</scroll-view>
</template>

<script>
	import { mapState, mapActions } from 'vuex';
	import { getCollection, getMyTeams } from '../../common/js/db.js';
	import { formatDate } from '../../common/js/utils.js';
	
	export default {
		data() {
			return {
				notice: null,
				loading: false
			}
		},
		
		computed: {
			isMaster() {
				return this.team.master_id === this.openid;
			},
			...mapState(['team', 'openid', 'teams'])
		},
		
		onLoad({ info }) {
			this.info = info
			info = JSON.parse(info)
			this.notice_id = info.notice_id;
			this.team_id = info.team_id;
		},
		
		onShow() {
			this.loading = true;
			
			const prom = new Promise((resolve, reject) => {
				let subProm;
				
				if(this.openid) {
					subProm = Promise.resolve(this.openid);
				} else {
					subProm = this.login();
				}
				
				subProm.then(openid => {
					if(!this.teams) {
						return getMyTeams(openid);
					}
					return this.teams;
				}).then(teams => {
					// 是否加入改团队
					const index = teams.findIndex(team => team.id === this.team_id)
					if(index > -1) resolve();
					else reject('is not team member');
				});
			});
			
			prom.then(() => {
				if(this.notice_id) {
				  return this.loadData().then(() => this.loading = false);
				}
			}).catch(() => {
				// 跳转到邀请页面
				uni.navigateTo({
					url: '../invite/invite?info=' + this.info
				})
			})
		},
		
		onShareAppMessage() {
			return {
				title: this.team.name + '的公告: ' + this.notice.title
			}
		},
		
		methods: {
			loadData() {
				const noticeCollection = getCollection('notice');
				return noticeCollection.doc(this.notice_id).get().then(res => {
					this.notice = this._formatData(res.data);
					return this.notice;
				})
			},
			
			toggleLike() {
				this.notice.hasLike = !this.notice.hasLike;
				this.notice.thumbs = this.notice.hasLike ? this.notice.thumbs + 1: this.notice.thumbs - 1;
				// 更新点赞
				this.$u.debounce(() => {
					wx.cloud.callFunction({
						name: 'notice',
						data: {
							type: 'update_likes',
							params: {
								notice_id: this.notice._id,
								openid: this.openid,
								like: !!this.notice.hasLike
							}
						}
					})
				}, 600);
			},
			
			onEdit() {
				uni.navigateTo({
					url: 'notice-create?notice_id=' + this.notice._id
				})
			},
			
			_formatData(item) {
				item.thumbs = item.likes.length;
				item.hasLike = item.likes.findIndex(openid => this.openid === openid) !== -1;
				item.date = formatDate('yyyy-MM-dd hh:mm', new Date(item.date));
				return item;
			},
			
			...mapActions(['login'])
		}
	}
</script>

<style lang="scss">
.notice-detail-page {
	.main {
		padding: 14px 20px;
		.title {
			font-size: 36rpx;
			font-weight: bold;
			color: $font-color;
			margin-bottom: 10px;
		}
		.info {
			display: flex;
			align-items: center;
			color: #ccc;
			padding: 4px 0px;
			.time {
				margin-left: 8px;
				font-size: 26rpx;
			}
			.edit-btn {
				margin-left: 20px;
				font-size: 28rpx;
				color: $color-primary;
			}
		}
		.content {
			font-size: 28rpx;
			line-height: 40rpx;
			color: $font-color-light-1;
			margin: 10px 0px;
		}
		.images {
			.image {
				width: 100%;
				margin-bottom: 10px;
				image {
					width: 100%;
				}
			}
		}
		.btns {
			display: flex;
			justify-content: space-around;
			margin: 40px 0px 20px 0px;
		}
	}
}
</style>
