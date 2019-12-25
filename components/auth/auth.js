const app = getApp()
const http = require('../../api/api.js')
import regeneratorRuntime from '../../api/regeneratorRuntime.js'
Component({
    options: {
        addGlobalClass: true,
    },
    properties: {
        showOverlay: {
            type: [Boolean, String],
            default: false
        },
        showLogin: {
            type: [Boolean, String],
            default: false
        }
    },
    data: {

    },
    attached() {

    },
    methods: {
        // 点击登录取消关闭登录授权框
        closePup() {
            this.setData({
                showOverlay: false,
                showLogin: false
            })
        },
        // 登录授权
        bindGetUserInfo(e) {
            let _this = this;
            if (e.detail.userInfo) {
                // 用户按了允许授权按钮
                // 获取到用户的信息了，打印到控制台上看下
                app.globalData.userInfo = e.detail.userInfo; // 把信息设置成全局
                wx.removeStorageSync('vid');
                wx.removeStorageSync('userInfo');
                wx.removeStorageSync('loginCode');
                wx.removeStorageSync('Authorization');
                wx.setStorageSync('userInfo', e.detail.userInfo);
                // 授权成功后,让实现页面显示出来，把授权页面隐藏起来
                _this.authLogin();
            } else {
                // 用户按了拒绝按钮
                wx.showModal({
                    title: '警告',
                    content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
                    showCancel: false,
                    success: function(res) {
                        // 用户没有授权成功，不需要改变 isHide 的值
                        if (res.confirm) {
                            wx.openSetting({
                                success: (res) => {
                                    if (res.authSetting["scope.userInfo"]) { // 如果用户重新同意了授权登录
                                        _this.authLogin();
                                    }
                                },
                                fail: function(res) {}
                            })
                        }
                    }
                });
            }
        },
        // 授权登录
        async authLogin() {
            let _this = this;
            wx.login({
                success: resdata => {
                    // 获取到用户的 code 之后：res.code 传给后台，再经过解析获取用户的 openid
                    wx.setStorageSync('loginCode', resdata.code)
                    wx.getUserInfo({
                        success: function(re) {
                            _this.getToken(resdata, re);
                        }
                    })
                }
            });
        },
        async getToken(resdata, re) {
            let _this = this;
            let url = '/api2/weixin.login/login';
            let method = 'post';
            let header = {};
            let data = {
                code: resdata.code,
                encryptedData: re.encryptedData,
                iv: re.iv
            };
            let loading = true;
            await http.auth_fetch(url, method, header, data, loading).then((res) => {
                wx.setStorageSync('unionid', res.data.unionid)
                wx.setStorageSync('openid', res.data.openid)
                wx.setStorageSync('session_key', res.data.session_key)
                wx.setStorageSync('Authorization', res.data.token)
                _this.get_vid();
                _this.setData({
                    Authorization: wx.getStorageSync('Authorization'),
                    showOverlay: false,
                    showLogin: false
                }, () => {
					if (getCurrentPages().length != 0) {
						//刷新当前页面的数据
						let route = getCurrentPages()[getCurrentPages().length - 1].route;
						if (app.globalData.type != '' && route == 'pages/index/index'){
							const pages = getCurrentPages()[getCurrentPages().length - 1]
							let type = { type: app.globalData.type}
							pages.onLoad(type)
							_this.get_userinfo();
						} else {
							_this.get_userinfo();
							const pages = getCurrentPages()[getCurrentPages().length - 1]
							pages.onLoad(pages.options)
						}
					}
                })
            })
        },
		// 获取vid用于长链接
		async get_vid() {
			let _this = this;
			let url = '/api_merchants_food/h.user/get_user';
			let method = 'post';
			let header = {};
			let data = {};
			let loading = true;
			await http.auth_fetch(url, method, header, data, loading).then((res) => {
				wx.setStorageSync('vid', res.data.vid)
			})
		},
		// 获取vid用于长链接
		async get_userinfo() {
			let _this = this;
			let url = '/api2/myself/userinfo';
			let method = 'post';
			let header = {};
			let data = {};
			let loading = true;
			await http.auth_fetch(url, method, header, data, loading).then((res) => {
				wx.setStorageSync('mumu_userinfo', res.data)
			})
		},
    }
})