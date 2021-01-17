<template>
	<view class="list">
		<view
			v-for="(item, index) in listData"
			:key="item.key"
			:class="['list-item', {'list-item-first': !index}]"
			@click="toDetail(item.openid)"
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
					
					<view class="list-item-del" @click.stop="delItem(item)">
						<text class="tf-icon tf-icon-trash"></text>
					</view>
				</movable-view>
			</movable-area>
		</view>
		
		
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	
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
		
		computed: {
			...mapState(['team', 'openid'])
		},
		
		created() {
			this.listData = this._calcListData(this.members);
		},
		
		watch: {
			members(val) {
				this.listData = this._calcListData(val);
			}
		},
		
		methods: {
			_calcListData(arr) {
				return arr.map((item, index) => {
					item.xmove = 0;
					item.key = item.key + index;
					return item;
				});
			},
			
			toDetail(detail_id) {
				uni.navigateTo({
					url: '../../pages/rank/detail?detail_id=' + detail_id
				});
			},
			
			onTouchStart(e) {
				const { index } = e.currentTarget.dataset;
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
				if(delX < -10) {
					this.openMenu();
				} else if (delX > 10){
				  this.hideMenu();
				}
			},
			
			openMenu() {
				this.setXmove(-62);
			},
			
			hideMenu() {
				this.setXmove(0);
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
			},
			
			delItem(item) {
				this.$emit('delete', item);
			}
		}
	}
</script>

<style lang="scss">
	.list{
		.list-item {
			border-top: 1px solid #eee;
			overflow: hidden;
			// margin: 0 40rpx;
			position:relative;
			width: calc(100vw - 80rpx);
			height: 150rpx;
			margin: 0 auto;
			&.list-item-first { border-top: none}
			.movable-area {
				width: calc(100vw - 80rpx);
			}
			
			.movable-view {
				width: 790rpx;
				display: flex;
				
				.list-item-content {
					flex: 0 0;
					flex-basis: calc(100vw - 80rpx);
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
					line-height: 150rpx;
					text-align: center;
					> text {
						font-size: 40rpx;
					}
				}
			}
		}
	}
</style>
