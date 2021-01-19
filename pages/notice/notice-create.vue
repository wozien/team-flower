<template>
	<view class="tf-page notice-create-page">
		<view class="form">
			<u-field v-model="title" label="标题" placeholder="请输入标题"></u-field>
			<u-field v-model="content" type="textarea" label="内容" placeholder="请输入内容,不要超过200字" maxlength="210"></u-field>
			<tf-uploader v-model="fileList" :after-read="afterRead"></tf-uploader>
		</view>
		<view class="footer">
			<tf-button type="primary">确定发布</tf-button>
		</view>
	</view>
</template>

<script>
import TfUploader from '../../components/tf/tf-uploader.vue'
import { mapState } from 'vuex'
	
export default {
	components: {
		TfUploader
	},
	
	data() {
		return {
			title: '',
			content: '',
			fileList: []
		}
	},
	
	computed: {
		...mapState(['team'])
	},
	
	methods: {
		afterRead(files) {
			console.log(files);
			if(files.length) {
				const defs = files.map(file => {
					// TODO 加上团队前缀 这里有问题，真机不是以http开头的， 正则提取
					const fileName = file.url.replace('http://tmp/', '');
					console.log(fileName);
					// 上传云存储
					wx.cloud.uploadFile({
						cloudPath: 'team-flower/notice-images/' + fileName,
						filePath: file.url
					}).then(res => {
						file.fileID = res.fileID
						file.status = 'done'
					}).catch(e => {
						file.status = 'error'
						console.log(e.message)
					})
				});
			}
		}
	}
}
</script>

<style lang="scss">
	.notice-create-page {
		height: 100%;
		display: flex;
		flex-direction: column;
		background-color: #fff;
		.form {
			flex: 1;
		}
		.footer {
			flex: 0 0 70px;
			padding: 10px;
		}
	}
</style>
