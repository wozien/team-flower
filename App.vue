<script>
	import { mapMutations } from 'vuex';
	
	export default {		
		onLaunch(e) {	
			if (!wx.cloud) {
				console.error('请使用 2.2.3 或以上的基础库以使用云能力')
			} else {
				wx.cloud.init({
					env: 'mpyun-0ll9s',
					traceUser: true,
				});
				
				// this._setTarbar();
			}
		},
		
		methods: {
			_setTarbar() {
				const db = wx.cloud.database();
				const configCollection = db.collection('config');
				configCollection.doc('28ee4e3e601031110129bcf56a6d81ac').get().then(({ data }) => {
					if(data.notice) {
						this.addNoticeTab();
					}
				})
			},
			
			...mapMutations({
				addNoticeTab: 'ADD_NOTICE_TAB'
			})
		}
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	page {
		height: 100%;
		background-color: $bg-color;
		font-size:  28rpx;
		> view {
			height: 100%;
		}
	}
	page, view {
		box-sizing: border-box;
	}
	.tf-page {
		height: 100%;
	}
</style>
