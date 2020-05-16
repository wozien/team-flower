<template>
	<view class="list">
		<view
			v-for="(item, index) in listData"
			:key="item.key"
			:class="['list-item', {'list-item-first': !index}]"
		>
			<movable-area class="movable-area">
				<movable-view 
					class="movable-view"
					direction="horizontal"
					:out-of-bounds="true"
					:damping="100"
					:x="item.xmove"
					:disabled="!isMaster"
					:data-index="index"
					@touchstart="onTouchStart"
					@touchend="onTouchEnd"
				>
					<view class="list-item-content">
						<view class="order">
							<image v-if="item.order < 4" :src="`../../static/img/no${item.order}.png`"></image>
							<text v-else>{{ item.order }}</text>
						</view>
						<tf-avatar class="avatar" :url="item.avatar"></tf-avatar>
						<text class="name">{{ item.nickname }}</text>
						<text class="number" :class="{'hlight': item.order < 4}">{{ item.flowers }}</text>
					</view>
					
					<view class="list-item-del">
						<text>移除</text>
					</view>
				</movable-view>
			</movable-area>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'TfList',
	
		props:{
			members: {
				type: Array,
				default: () => []
			},
			isMaster: Boolean
		},
		
		data() {
			return {
				listData: []
			}
		},
		
		created() {
			this.listData = this.members.map(item => {
				item.xmove = 0;
				return item;
			});
		},
		
		watch: {
			members(val) {
				this.listData = val.map(item => {
					item.xmove = 0;
					return item;
				});
			}
		},
		
		methods: {
			toDetail(detail_id) {
				uni.navigateTo({
					url: '../../pages/rank/detail?detail_id=' + detail_id
				});
			},
			
			onTouchStart(e) {
				const { index } = e.currentTarget.dataset;
				console.log(index);
				this.index = index;
				this.startX = e.touches[0].clientX;
				this.startY = e.touches[0].clientY;
				const oldIndex = this.listData.findIndex((item, index) => item.xmove && index !== this.index);
				if(oldIndex > -1) {
					this.setXmove(0, oldIndex);
				}
			},
			
			onTouchEnd(e) {
				const endX = e.changedTouches[0].clientX;
				const endY = e.changedTouches[0].clientY;
				const angle = this.getAngle({x: this.startX, y: this.startY}, {x: endX, y: endY});
				if(!this.isMaster || Math.abs(angle) > 30) return;
				
				const delX = endX - this.startX;
				if(delX < -1) {
					this.openMenu();
				} else if (delX > 1){
				  this.hideMenu();
				}
			},
			
			openMenu() {
				// const item = this.listData[this.index];
				this.setXmove(-60);
				// if(!item.xmove) {
				// 	this.setXmove(-60);
				// }
			},
			
			hideMenu() {
				// const item = this.listData[this.index];
				// if(item.xmove) {
					this.setXmove(0);
				// }
			},
			
			getAngle(start, end) {
				const delX = end.x - start.x;
				const delY = end.y - start.y;
				return 360 * Math.atan(delY / delX) / (2 * Math.PI);
			},
	
			setXmove(x, index) {
				if(index === undefined) {
					index = this.index;
				}
				if(index != null) {
					const item = this.listData[index];
					item.xmove = x;
					this.listData.splice(index, 1, item);
				}
			}
		}
	}
</script>

<style lang="scss">
	.list{
		.list-item {
			border-top: 1px solid #eee;
			overflow: hidden;
			margin: 0px 20px;
			position:relative;
			height: 150rpx;
			&.list-item-first { border-top: none}
			.movable-area {
				width: 670rpx;
			}
			
			.movable-view {
				width: 790rpx;
				display: flex;
				
				.list-item-content {
					flex: 0 0 670rpx;
					display: flex;
					width: 670rpx;
					height: 150rpx;
					align-items: center;
					z-index: 2;
					background-color: #fff;
					.order{
						flex: 0 0 40px;
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
						padding-right: 6px;
						&.hlight {
							color: #ff6600
						}
					}
					.name {
						flex: 1;
						color: #666;
					}
				}
				
				.list-item-del {
					flex: 1;
					height: 150rpx;
					background-color: #ed4014;
					color: #fff;
				}
			}
		}
	}
</style>
