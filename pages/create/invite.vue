<template>
	<view class="invite-page">
		<view class="content">
			<image src="../../static/img/invite.png"></image>
			<text class="text">Hi, 你来了~</text>
			<text class="text">{{ master }} 邀请你加入 {{ team_name }} 团队</text>
			<tf-button v-if="!isInvite" type="primary" open-type="share">立即邀请好友</tf-button>
			<block v-else>
				<tf-button type="primary" @click.native="join">立即加入</tf-button>
				<text class="create-my" @click="createTeam">我要创建自己的团队</text>
			</block>
		</view>
	</view>
</template>

<script>
	
	const app = getApp();
	
	export default {
		data() {
			return {
				master: '',
				team_id: '',
				team_name: '',
				invite: 0
			}
		},
		
		computed: {
			isInvite() {
				return (this.invite || [1007, 1008].includes(app.globalData.scene));
			}
		},
		
		onLoad({info}) {
			info = JSON.parse(info);
			this.master = info.master
			this.team_id = info.team_id
			this.team_name = info.team_name
			this.invite = info.invite || 0
		},
		
		onShareAppMessage(res) {
			if(res.from === 'button') {
				console.log(res.target);
			}
			const data = {
				master: this.master,
				team_id: this.team_id,
				team_name: this.team_name,
				invite: 1
			}
			return {
				title: this.master + '邀请你加入' + this.team_name,
				page: '/pages/create/invite?info=' + JSON.stringify(data)
			}
		},
		
		methods: {
			createTeam() {
				uni.navigateTo({
					url: '../index/index?is_create=1'
				})
			}
		}
	}
</script>

<style lang="scss">
	.invite-page {
		height: 100%;
		background-color: #f8f8f8;
		padding: 30px;
		margin-top: 35%;
		.content {
			display: flex;
			flex-direction: column;
			image {
				width: 45px;
				height: 50px;
				margin-bottom: 6px;
			}
			.text {
				color: #666;
				font-size: 32rpx;
				margin-top: 6px;
				margin-left: 6px;
			}
			/deep/ .tf-button {
				margin-top: 36px;
				width: 320px;
			}
			.create-my {
				color: #999;
				font-size: 26rpx;
				margin-top: 20px;
				text-align: center;
			}
		}
	}
</style>
