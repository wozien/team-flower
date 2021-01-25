<template>
	<view class="tf-page notice-create-page">
		<view class="form">
			<u-field v-model="title" label="标题" placeholder="请输入标题"></u-field>
			<u-field v-model="content" type="textarea" label="内容" placeholder="请输入内容,不要超过200字" maxlength="210"></u-field>
			<tf-uploader v-model="fileList" :after-read="afterRead" @delete="onDeleteImg"></tf-uploader>
		</view>
		<view class="footer">
			<tf-button type="primary" :loading="loading" @click="$u.debounce(onConfirm, 600, true)">确定发布</tf-button>
		</view>
	</view>
</template>

<script>
import TfUploader from '../../components/tf/tf-uploader.vue'
import { mapState, mapMutations } from 'vuex'
import { getCollection } from '../../common/js/db.js';
	
export default {
	components: {
		TfUploader
	},
	
	data() {
		return {
			title: '',
			content: '',
			fileList: [],
			loading: false
		}
	},
	
	computed: {
		...mapState(['team', 'userInfo', 'openid', 'triggerShowHook'])
	},
	
	onLoad({ notice_id }) {
		this.notice_id = notice_id;
	},
	
	onShow() {
		if(!this.triggerShowHook) {
			this.setShowTrigger(true); return;
		}
		
		if(this.notice_id) {
			this.loadData();
		}
		
		const title = this.notice_id ? '编辑' : '创建';
		uni.setNavigationBarTitle({
			title: title + '公告'
		});
	},
	
	methods: {
		_getFileName(url) {
			const matches = /\.\w+$/i.exec(url);
			const ext = matches && matches[0] || '.jpg';
			return this.team._id + '_' + this.$u.guid(16) + ext;
		},
		
		loadData() {
			const noticeCollection = getCollection('notice');
			return noticeCollection.doc(this.notice_id).get().then(res => {
				const notice = res.data;
				this.title = notice.title;
				this.content = notice.content;
				this.fileList = notice.images.map(url => ({
					url,
					fileID: url,
					status: 'done'
				}));
			})
		},
		
		afterRead(files) {
			const getFileName = this.getFileName;
			
			if(files.length) {
				files.forEach(file => {
					const fileName = this._getFileName(file.url);
					
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
		},
		
		onConfirm() {
			if(!this.title) {
				this.$toast('标题不能为空'); return;
			} 
			
			const images = this.fileList.map(file => {
				return file.status === 'done' && file.fileID;
			})
			
			let prom, data;
			if(this.notice_id) {
				// update notice
				data = {
					title: this.title,
					content: this.content,
					date: Date.now(),
					images
				};
				prom = this._updateNotice(data);
			} else {
				data = {
					title: this.title,
					content: this.content,
					team_id: this.team._id,
					date: Date.now(),
					avatar: this.userInfo.avatarUrl,
					creator: this.userInfo.nickName,
					likes: [],
					images
				};
				prom = this._createNotice(data);
			}

			this.loading = true;
			return prom.then(() => {
				this.$toast('发布成功').then(() => {
					this.loading = false;
					setTimeout(() => {
						uni.navigateBack({});
					}, 600);
				});
			}).catch(e => {
				this.loading = false;
				this.$toast('发布失败: ' + e.message);
			});
		},
		
		onDeleteImg(file) {
			const fileID = file && file.fileID;
			const index = this.fileList.findIndex(file => file.fileID === fileID);
			if(index > -1) {
				this.fileList.splice(index, 1);
			}
			
			if(fileID) {
				// 调用云函数函数图片文件
				wx.cloud.deleteFile({
					fileList: [fileID]
				}).then(res => {
					// console.log(res)
				}).catch(e => {
					this.$toast(e.message);
				})
			}
		},
		
		_createNotice(data) {
			const noticeCollection = getCollection('notice');
			return noticeCollection.add({ data });
		},
		
		_updateNotice(data) {
			return wx.cloud.callFunction({
				name: 'notice',
				data: {
					type: 'update_notice',
					params: {
						notice_id: this.notice_id,
						notice: data
					}
				}
			});
		},
		
		...mapMutations({
			setShowTrigger: 'SET_ONSHOW_TRIGGER'
		})
	}
}
</script>

<style lang="scss">
	.notice-create-page {
		height: 100%;
		display: flex;
		flex-direction: column;
		background-color: #fff;
		.u-textarea-inner textarea {
			min-height: 160px;
		}
		.form {
			flex: 1;
		}
		.footer {
			flex: 0 0 70px;
			padding: 10px;
		}
	}
</style>
