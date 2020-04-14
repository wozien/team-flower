<template>
	<view class="give-page">
		<view class="number">
			<text>{{ desc }}</text>
			<input type="number" v-model="number" placeholder="0.0" :focus="true" />
		</view>
		<view class="message">
			<textarea placeholder="感谢你的辛勤付出~" v-model="message" :focus="true"/>
		</view>
		<view class="flower">
			<tf-icon icon="flower-plain" :size="34" style="color: #ccc"></tf-icon>
			<text>{{ number }}</text>
		</view>
		
		<tf-button :type="add ? 'assia' : 'primary'" :width="200">{{ desc + '小红花'}}</tf-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				add: true,
				to: {},
				number: '',
				message: ''
			}
		},
		
		computed: {
			desc() {
				return this.add ? '赠送' : '扣除';
			}
		},
		
		onLoad({item}) {
			item = JSON.parse(decodeURIComponent(item))
			this.add = item.add;
			this.to = item.to;	
			const title = (this.add ? '感谢' : '扣除') + this.to.nickname;
			uni.setNavigationBarTitle({
				title
			})
		}
	}
</script>

<style lang="scss">
	.give-page{
		height: 100%;
		background-color: #fff;
		padding: 0 12px;
		overflow: hidden;
		>view {
			background-color: #f0f0f0;
			padding: 10px;
			border-radius: 4px;
			&.number {
				padding: 10px;
				display: flex;
				margin-top: 16px;
				align-items: center;
				> text {
					flex: 0 0 30px;
					font-size: 26rpx;
					color: #666;
					text-align: right;
				}
				> input {
					flex: 1;
					color: #666;
					font-size: 36rpx;
					font-weight: 500;
					padding: 2px 10px;
					text-align: right;
				}
			}
			&.message {
				margin-top: 10px;
				padding: 14px;
				>textarea {
					width: 100%;
					height: 50px;
					font-size: 26rpx;
					color: #999;
				}
			}
			&.flower {
				background-color: #fff;
				height: 100px;
				display: flex;
				align-items: center;
				justify-content: center;
				> text {
					font-size: 74rpx;
					font-weight: 600;
					color: rgba(128,128,128, .5);
				}
			}
		}
	}
</style>
