<template>
	<view class="tf-layout">
		<view class="bg">
			<view class="raduis-bg" :style="{marginTop: mgTop + 'px'}"></view>
		</view>
		<view class="content">
			<view class="header" :style="{flexBasis: mgTop + 40 + 'px'}">
				<slot name="header"></slot>
			</view>
			<scroll-view 
			  class="scroll" 
				scroll-y="true" 
				:style="{height: scrollHeight + 'px'}" 
				:lower-threshold="20"
				@scrolltolower="reachBottom">
				<slot></slot>
			</scroll-view>
			<view class="footer" v-if="showFooter">
				<slot name="footer"></slot>
			</view>
		</view>
	</view>
</template>

<script>
	const systemInfo = uni.getSystemInfoSync();
	
	export default {
		props: {
			mgTop: {
				type: Number,
				default: 100
			},
			height: Number,
			showFooter: {
				type: Boolean,
				default: true
			}
		},
		
		data() {
			return {
				
			};
		},
		
		computed: {
			scrollHeight() {
				// 算出滚动的高度
				let contentHeight;
				if(this.height) {
					contentHeight = this.height
				} else {
					contentHeight = systemInfo.screenHeight - systemInfo.statusBarHeight - 40
				}
				let res = contentHeight - this.mgTop - 40;
				if(this.showFooter) {
					res = res - 70;
				}
				return res;
			}
		},
		
		methods:{
			reachBottom() {
				console.log('on reach');
				this.$emit('scroll-lower');
			},
			
			onReachBottom() {
				console.log('dasdas')
			}
		}
	}
</script>

<style lang="scss">
.tf-layout {
	height: 100%;
	position: relative;
	>view {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		overflow: hidden;
	}
	.bg {
		background-color: $color-primary;
		.raduis-bg {
			height: 100%;
			background-color: #fff;
			border-radius: 40px;
		}
	}
	.content {
		display: flex;
		flex-direction: column;
		.header {
			flex-shrink: 0;
			flex-grow: 0;
		}
		.scroll {
			flex: 1;
		}
		.footer {
			flex: 0 0 70px;
		}
	}
}
</style>
