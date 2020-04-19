<template>
	<view class="rename-page">
		<input type="text" :focus="true" v-model="name" placeholder="请输入昵称" placeholder-style="color: #999"/>
		<tf-button type="primary" class="btn" @click="rename">立即修改</tf-button>
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	import { getCollection } from '../../common/js/db.js';
	
	export default {
		data() {
			return {
				name: ''
			}
		},
		
		computed: {
			...mapState(['openid', 'team'])
		},
		
		onShow() {
			uni.setNavigationBarTitle({
				title: '修改昵称'
			})
		},
		
		methods: {
			rename() {
				if(!this.name) {
					uni.showToast({
						title: '昵称不能为空',
						icon: 'none'
					});
					return;
				}
				
				 wx.cloud.callFunction({
					 name: 'team',
					 data: {
						 type: 'rename',
						 params: {
							 team_id: this.team._id,
							 openid: this.openid,
							 nickname: this.name
						 }
					 }
				 }).then(res => {
					 uni.$emit('rename', this.name);
					 uni.navigateBack({});
				 });
			}
		}
	}
</script>

<style lang="scss">
	.rename-page {
		height: 100%;
		background-color: #f8f8f8;
		padding-top: 10px;
		> input {
			background: #fff;
			padding: 14px 10px;
			color: #999;
		}
		
		.btn {
			display: block;
			margin: 60px  10px;	
		}
	}
</style>
