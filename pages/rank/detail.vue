<template>
	<view class="rank-detail">
		<tf-layout :mg-top="60">
			<view class="member" slot="header">
				<tf-avatar :url="member.avatar" class="avatar" size="large"></tf-avatar>
				<view class="name-and-rank">
					<text class="name">{{ member.nickname }}</text>
					<text class="rank">第 {{ member.order || '' }} 名</text>
				</view>
				<view class="flower">
					<text class="number">{{ member.flowers }}</text>
					<image src="../../static/img/flower.png"></image>
				</view>
			</view>
			<!-- history list -->
			<view class="list"></view>
			
			<view class="footer" slot="footer">
				<tf-button v-if="isMaster && !isSelf" :width="125" size="small" icon="close" style="margin-right: 16px;">扣除</tf-button>
				<tf-button v-if="isSelf" :width="125" size="small" icon="update">修改昵称</tf-button>
				<tf-button v-else :width="125" size="small" icon="aixin" type="assia">感谢</tf-button>
			</view>
		</tf-layout>
	</view>
</template>

<script>
	import TfLayout from '@/components/tf/tf-layout.vue';
	import { mapState } from 'vuex';
	import { getCollection } from '../../common/js/db.js';
	
	export default {
		components:{
			TfLayout
		},
		
		data() {
			return {
				history: [],
				member: {},
				to: ''
			}
		},
		
		computed: {
			isSelf() {
				return this.member.openid === this.openid;
			},
			isMaster() {
				return this.team.master_id === this.openid;
			},
			...mapState(['team', 'openid'])
		},
		
		onLoad({detail_id}) {
			this.to = detail_id;
			this.member = this.team.members.find(mb => mb.openid === detail_id);
			
			// 获取流水记录
			const historySet = getCollection('history');
			historySet.where({
				team_id: this.team._id,
				to: this.to
			}).get().then(res => {
				console.log(res)
				if(res.errMsg === 'collection.get:ok') {
					this.formatHistory(res.data)
				}
			})
		},
		
		methods: {
			formatHistory(data) {
				data.forEach(item => {
					item.from = this.team.members.find(mb => mb.openid === item.from);
				})
				this.history = data;
			}
		}
	}
</script>

<style lang="scss">
	.rank-detail {
		height: 100%;
		.member {
			display: flex;
			align-items: center;
			margin-top: 20px;
			padding: 0 30px;
			.avatar {
				margin-right: 10px;
				flex: 0 0 auto;
			}
			.name-and-rank {
				flex: 1;
				display: flex;
				flex-direction: column;
				.name {
					color: #fff;
					font-size: 36rpx;
					font-weight: 600;
				}
				.rank {
					color: $color-primary;
					font-size: 26rpx;
					margin-top: 6px;
				}
			}
			.flower {
				flex: 0 0 auto;
				background-color: #f0f0f0;
				border-radius: 20px;
				display: flex;
				align-items: center;
				padding: 6px 14px;
				.number {
					font-size: 36rpx;
					color: #FF6600;
					font-weight: 600;
					margin-right: 6px;
				}
				>image {
					width: 25px;
					height: 25px;
				}
			}
		}
		.footer {
			padding-top: 6px;
			display: flex;
			justify-content: center;
		}
	}
</style>
