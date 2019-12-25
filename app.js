//app.js
App({
    onLaunch: function() {
        wx.getSystemInfo({
            success: e => {
				this.globalData.windowWidth = e.windowWidth;
				this.globalData.windowHeight = e.windowHeight;
                this.globalData.StatusBar = e.statusBarHeight;
                let custom = wx.getMenuButtonBoundingClientRect();
                this.globalData.Custom = custom;
                this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
            }
        })
    },
    // 全局数据
    globalData: {
		timer: require('/utils/wxTimer.js')
    }
})