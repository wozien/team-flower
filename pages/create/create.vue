<template>
	<view class="create-page">
			<text>请输入你的团队名称</text>
			<input type="text" :focus="true" v-model="name"/>
			<tf-button type="primary" class="create-btn" @click="onCreate">立即创建</tf-button>
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	import { getCollection } from '@/common/js/db.js';
	import Team from '@/common/js/Team.js';
	
	export default {
		
		data() {
			return {
				name: ''
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
					// TODO 团队名重复校验

					const teamCollection = getCollection('team');
					const teamData = new Team(this.name, this.openid, this.userInfo);
					
					teamCollection.add({
						data: teamData
					}).then(res => {
						const data = {
							team_id: res._id,
							team_name: this.name,
							master: this.userInfo.nickName,
						}
						uni.redirectTo({
							url: './create-success?info=' + JSON.stringify(data)
						});
					})
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
		> text {
			color: #999;
			padding-left: 10px;
		}
		
		> input {
			background: #fff;
			padding: 10px;
			color: #999;
			margin-top: 10px;
			margin-bottom: 50px;
		}
		
		.create-btn {
			display: block;
			margin:0px  10px;

		}
		
	}
</style>

