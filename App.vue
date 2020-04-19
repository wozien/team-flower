<script>
	export default {		
		onLaunch(e) {	
			if (!wx.cloud) {
				console.error('请使用 2.2.3 或以上的基础库以使用云能力')
			} else {
				wx.cloud.init({
					env: 'mpyun-0ll9s',
					traceUser: true,
				})
			}
		}
	}
</script>

<style lang="scss">
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
</style>
