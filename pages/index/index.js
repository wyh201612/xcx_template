const app = getApp();
Page({
    data: {
        PageCur: 'home'
    },
    onLoad: function(options) {
		let _this = this;
        // type其他页面跳转到index页面对应显示的页面
        // type为home、mall、car、order
        if (options.type) {
			_this.setData({
				PageCur: ''
			},()=>{
				setTimeout(() => {
					_this.setData({
						PageCur: options.type
					})
				}, 20)
			})
        }
    },
    NavChange(e) {
        this.setData({
			PageCur: e.currentTarget.dataset.cur
        }, () => {
			app.globalData.type = e.currentTarget.dataset.cur;
            if (e.currentTarget.dataset.cur == 'mall') {
                this.setData({
					sort_type: 0
				})
            }
        })
    }
})