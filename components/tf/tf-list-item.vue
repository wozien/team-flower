<template>
	<view :class="['list-item', {'list-item-first': !index}]">
		<movable-area>
			<movable-view 
				class="list-item-inner"
				direction="horizontal" 
				:out-of-bounds="true"
				:damping="100"
				:x="x"
				@touchstart="onTouchStart"
				@touchend="onTouchEnd"
			>
				<view class="order">
					<image v-if="member.order < 4" :src="`../../static/img/no${member.order}.png`"></image>
					<text v-else>{{ member.order }}</text>
				</view>
				<tf-avatar class="avatar" :url="member.avatar"></tf-avatar>
				<text class="name">{{ member.nickname }}</text>
				<text class="number" :class="{'hlight': member.order < 4}">{{ member.flowers }}</text>
			</movable-view>
		</movable-area>
		
		<view class="list-item-menu">
			<view class="menu-item give">赠送</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'ListItem',
		
		props: {
			member: Object
		},
		
		data() {
			return {
				x: 0,
				startX: 0,
				openStatus: false
			}
		},
		
		methods: {
			onTouchStart(e) {
				this.startX = e.touches[0].clientX;
			},
			
			onTouchEnd(e) {
				const endX = e.changedTouches[0].clientX;
				const delX = endX - this.startX;
				
				if(delX < -1) {
					!this.openStatus && this.openMenu();
				} else if (delX > 1){
					this.openStatus && this.hideMenu();
				}
			},
			
			openMenu() {
				this.x = -140;
				this.openStatus = true;
			},
			
			hideMenu() {
				this.x = 0;
				this.openStatus = false;
			}
		}
	}
</script>

<style lang="scss">
	movable-area {
		width: 530rpx;
	}
	.list-item {
		border-top: 1px solid #eee;
		overflow: hidden;
		margin: 0px 20px;
		position:relative;
		height: 150rpx;
		&.list-item-first { border-top: none}
		.list-item-inner {
			box-sizing: border-box;
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
	
		.list-item-menu {
			background-color: $color-assistant-1;
			position: absolute;
			top: 0;
			right: 0;
			left: 50rpx;
			height: 150rpx;
			z-index: 1;
			display: flex;
			justify-content: flex-end;
			align-items: stretch;
			.menu-item {
				line-height: 150rpx;
				text-align: center;
				color: white;
				font-size: 26rpx;
				flex: 0 0 140rpx;
				&.give {
					background-color: $color-assistant-1;
				}
			}
		}
	}
</style>
