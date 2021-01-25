<template>
	<view class="tf-uploader">
		<view class="tf-uploader__preview" v-for="(item, index) in list" :key="item.url" @click="previewImg(index)">
			<image :src="item.url" mode="aspectFill"></image>
			<view class="mask" v-if="item.status !== 'done'" >
				<u-loading v-if="item.status === 'uploading'" color="#fff" mode="flower" size="40"></u-loading>
			</view>
			<view class="trash" v-if="item.status === 'done'" @click.stop="deleteImg(item)">
				<text class="tf-icon tf-icon-close"></text>
			</view>
		</view>
		<view class="tf-uploader__upload" @click="chooseImg" v-show="showUpload">
			<text class="tf-icon tf-icon-camera"></text>
		</view>
	</view>
</template>

<script>
	import { mapMutations } from 'vuex';
	 
	export default {
		props: {
			value: {
				type: Array,
				default: () => []
			},
			maxCount: {
				type: Number,
				default: 6
			},
			afterRead: {
				type: Function,
				require: true
			}
		},
		
		computed: {
			list() {
				return this.value;
			},
			showUpload() {
				return this.list.length < this.maxCount;
			}
		},
		
		methods: {
			chooseImg() {
				this.setShowTrigger(false); // 不触发当前页面的onshow钩子
				uni.chooseImage({
					count: 6,
					success: res => {
						const files = res.tempFilePaths.map(url => ({ url, status: 'uploading' }));
						if(files.length) {
							this.$emit('input', [...this.value, ...files]);
						}
						this.afterRead && this.afterRead.call(this.$parent, files);
					}
				});
			},
			
			previewImg(index) {
				const urls = this.list.map(item => item.url);
				if(urls.length) {
					uni.previewImage({
						urls,
						current: index
					});
				}
			},
			
			deleteImg(file) {
				this.$emit('delete', file);
			},
			
			...mapMutations({
				setShowTrigger: 'SET_ONSHOW_TRIGGER'
			})
		}
	}
</script>

<style lang="scss">
.tf-uploader {
	padding: 10px;
	display: flex;
	flex-wrap: wrap;
	.tf-uploader__upload {
		width: 80px;
		height: 80px;
		line-height: 80px;
		text-align: center;
		background-color: #f7f8fa;
		margin: 0px 8px 8px 0px;
		.tf-icon {
			font-size: 48rpx;
			color: #dcdee0;
		}
	}
	.tf-uploader__preview {
		width: 80px;
		height: 80px;
		margin: 0px 8px 8px 0px;
		overflow: hidden;
		position: relative;
		image {
			width: 80px;
			height: 80px;
		}
		.mask {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: rgba(50, 50, 51, 0.88);
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.trash {
			position: absolute;
			top: 0;
			right: 0;
			width: 14px;
			height: 14px;
			background-color: rgba(0, 0, 0, 0.7);
			border-radius: 0 0 0 12px;
			.tf-icon-close {
				position: absolute;
				top: -2px;
				right: -2px;
				color: #fff;
				font-size: 16px;
				-webkit-transform: scale(0.5);
				transform: scale(0.5);
			}
		}
	}
}
</style>
