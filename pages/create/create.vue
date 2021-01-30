<template>
	<view class="create-page">
		<view class="title">请输入你的团队名称</view>
		<input type="text" :focus="true" v-model="name"  :maxlength="14"/>
		<tf-button type="primary" class="create-btn" :loading="loading" @click="$u.debounce(onCreate, 600, true)" :width="220">立即创建</tf-button>
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	import { getCollection, getMyTeams } from '@/common/js/db.js';
	import { version } from '@/common/js/config.js';
	import Team from '@/common/js/Team.js';
	
	export default {
		
		data() {
			return {
				name: '',
				loading: false
			}
		},
		
		computed: {
			...mapState(['openid', 'userInfo'])
		},
		
		onShow() {
			uni.setNavigationBarTitle({
				title: '创建团队'
			})
		},
		
		methods:{
			onCreate() {
				if(this.name) {
					this.loading = true;
					wx.cloud.callFunction({
						name: 'check',
						data: {
							type: 'check_msg',
							params: {
								content: this.name
							}
						}
					}).then(({ result }) => {
						if(result.code !== 0) {
							return Promise.reject(result.msg);
						}	
						return getMyTeams(this.openid);
					}).then(teams => {
						// 最多创建5个团队
						if(teams.length >= 5) {
							return Promise.reject('最多只能创建5个团队哦~');
						}
						const index = teams.findIndex(team => team.name === this.name);
						if(index > -1) {
							return Promise.reject('团队名不能重复哦~');
						}
					}).then(() => {
						const teamCollection = getCollection('team');
						const teamData = new Team(this.name, this.openid, this.userInfo);
						teamData.version = version;
						return teamCollection.add({
							data: teamData
						});
					}).then(res => {
						const data = {
							team_id: res._id,
							team_name: this.name,
							master: this.userInfo.nickName,
						}
						uni.redirectTo({
							url: './create-success?info=' + JSON.stringify(data)
						});
					}).catch(reason => {
						this.$toast(reason);
					}).finally(() => this.loading = false);
					
				} else {
					this.$toast('团队名不能为空');
				}	
			}
		}
	}
</script>

<style lang="scss">
	.create-page {
		height: 100%;
		background-color: #f8f8f8;
		padding-top: 20px;
		.title {
			padding-left: 10px;
			font-size: 28rpx;
			text-align: center;
			margin-bottom: 20px;
		}
		
		input {
			background: #fff;
			padding: 10px;
			color: #999;
			margin-top: 10px;
			margin-bottom: 100px;
			text-align: center;
			padding: 20px 10px;
		}
		
	}
</style>

