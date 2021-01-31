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
		_getExt(url) {
			const matches = /\.\w+$/i.exec(url);
			return matches && matches[0] || '.jpg';
		},
		
		_getFileName(url) {
			return this.team._id + '_' + this.$u.guid(16) + this._getExt(url);
		},
		
		_getMimeType(url) {
			return 'image/' + this._getExt(url).slice(1); 
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
			if(files.length) {
				files.forEach(file => {
					if(file.status === 'uploading') {
						const mimeType = this._getMimeType(file.url);
						// 图片安全检测
						wx.cloud.callFunction({
							name: 'check',
							data: {
								type: 'check_img',
								params: {
									mimeType,
									img: wx.cloud.CDN({
										type: 'filePath',
										filePath: file.url
									})
								}
							}
						}).then(({ result }) => {
							if(result.code !== 0) {
								file.status = 'error'
								file.msg = result.msg || '违规图片'
							} else {
								file.status = 'done'
							}
						}).catch(e => {
							console.log(e)
						})
					}
				});
			}
		},
		
		onConfirm() {
			if(!this.title) {
				this.$toast('标题不能为空'); return;
			} 
			
			const content = this.title + this.content;  // 校验文本
			this.loading = true
			wx.cloud.callFunction({
				name: 'check',
				data: {
					type: 'check_msg',
					params: {
						content
					}
				}
			}).then(({ result }) => {
				if(result.code !== 0) return Promise.reject(result.msg);
				
				const hasError = this.fileList.find(file => file.status === 'error');
				if(hasError) {
					return Promise.reject('存在不合法图片');
				}
				
				const defs =  this.fileList.map(file => {
					if(file.fileID) {
						return Promise.resolve(file.fileID);
					}
					// 上传云存储
					const fileName = this._getFileName(file.url);
					return wx.cloud.uploadFile({
						cloudPath: 'team-flower/notice-images/' + fileName,
						filePath: file.url
					}).then(res => res.fileID)
				});
				return Promise.all(defs);
				
			}).then(images => {
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
						likes: [],
						images
					};
					prom = this._createNotice(data);
				}
				return prom;
			}).then(() => {
				this.$toast('发布成功').then(() => {
					this.loading = false;
					setTimeout(() => {
						uni.navigateBack({});
					}, 600);
				});
			}).catch(msg => {
				this.loading = false;
				this.$toast('发布失败: ' + msg);
			});
		},
		
		onDeleteImg(file, index) {
			this.fileList.splice(index, 1);
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
