# team-flower: 一款简单的团队积分管理工具

## 技术栈
uni-app + 小程序云开发

## 运行
- `git clone`	项目到本地，推荐用`HBuilder`打开
- 利用微信开发工具申请一个云开发服务器， 并部署[小程序云开发项目](https://github.com/wozien/team-flower-cloud)
- 修改 `App.vue` 下的云服务器配置：
  ```js
	onLaunch(e) {
		if (!wx.cloud) {
			console.error('请使用 2.2.3 或以上的基础库以使用云能力')
		} else {
			wx.cloud.init({
				env: 'mpyun-0ll9s', // 这里修改成自己申请服务器名
				traceUser: true,
			})
		}
	}
	```
- 在云储存中新建两个数据库 `team` 和 `history`, 并修改自定义权限为：
  ```js
	{
	  "read": true,
	  "write": true
	}
	```
- 在`Hbuilder`配置微信开发者工具路径，点击运行到小程序

## 友链

![](https://wozien-cloud-oss.oss-cn-shenzhen.aliyuncs.com/images/avatar/68747470733a2f2f626c6f672e696e6f6f622e78797a2f7465616d666c6f7765722d7172636f64652e6a7067.jpeg)
