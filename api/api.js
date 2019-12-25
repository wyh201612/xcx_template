const util = require('../utils/util.js')

let mumu_url_host = 'https://dev.mumuhome.net' //木木福利测试域名
// let mumu_url_host = 'https://api.mumuhome.net' //木木福利正式域名

let shop_url_host = 'https://tshop.mumuhome.net' //商城测试域名
// let shop_url_host = 'https://shop.mumuhome.net' //商城正式域名

// 调用fetch方法，然后依次链式传入 url, method, header, data, loading(是否显示loading)
// shop域名接口
function fetch(url, method, header, data, loading) {
    let Authorization = wx.getStorageSync('Authorization')
	if (method != 'get'){
		var timestamp = new Date().getTime().toString();
		timestamp = timestamp.slice(0, -3);
		let obj = {}
		if (data.phone_type == 4) {
			obj = {
				_time: timestamp, // 时间 1234567890987
				phone_type: 4, // 1 iOS 2 android 3 web 1 和 2 微信开发者支付 3微信公众号支付 4微信小程序支付
				device: 'web', // 设备名称
			}
		} else {
			obj = {
				_time: timestamp, // 时间 1234567890987
				phone_type: 3, // 1 iOS 2 android 3 web 1 和 2 微信开发者支付 3微信公众号支付 4微信小程序支付
				device: 'web', // 设备名称
			}
		}
		data = Object.assign(data, obj)
		data = util.sign(data);
	}
    // 判断给服务端传递undefined的问题
	return new Promise((resolve, reject) => {
        if (loading) {
            wx.showLoading({
                icon: 'loading'
            })
        }
        wx.request({
			url: shop_url_host + url,
            method: method ? method : 'GET',
            header: {
                'Accept': 'application/json',
                'Authorization': Authorization
            },
            data: data,
            success: (res) => {
                if (res.statusCode === 200) {
					if (res.data.hasOwnProperty("code")){
						if (res.data.code == 0) {
							resolve(res.data)
							wx.hideLoading()
						} else {
							if (res.data.code == 211) { // 验证失败（例如：token过期）就返回211，请求头中没有token也返回211,拿到状态码为211，就清除token信息并跳转到登录页面
								wx.removeStorageSync('mumu_userinfo');
								wx.removeStorageSync('Authorization');
								wx.showModal({
									title: '提示',
									content: '登录过期！',
									showCancel: false,
									success(res) {
										if (res.confirm) {
											wx.reLaunch({
												url: '/pages/index/index?type=order',
											})
										}
									}
								})
								wx.hideLoading()
								return
							}
							wx.showModal({
								title: '提示',
								content: res.data.message,
								showCancel: false
							})
							wx.hideLoading()
							return
						}
					} else {
						resolve(res)
						wx.hideLoading()
					}
                } else {
					wx.showModal({
						title: '提示',
						content: res.data,
						showCancel: false
					})
					wx.hideLoading()
                    reject(res.data)
                }
            },
            fail: function(err) {
				wx.showModal({
					title: '提示',
					content: err,
					showCancel: false
				})
				wx.hideLoading()
                reject(err)
            }
        })
    })
}

// 调用auth_fetch方法，然后依次链式传入 url, method, header, data, loading(是否显示loading)
// dev域名接口
function auth_fetch(url, method, header, data, loading) {
	let Authorization = wx.getStorageSync('Authorization')
	if (method != 'get') {
		var timestamp = new Date().getTime().toString();
		timestamp = timestamp.slice(0, -3);
		let obj = {}
		if (data.phone_type == 4) {
			obj = {
				_time: timestamp, // 时间 1234567890987
				phone_type: 4, // 1 iOS 2 android 3 web 1 和 2 微信开发者支付 3微信公众号支付 4微信小程序支付
				device: 'web', // 设备名称
			}
		} else {
			obj = {
				_time: timestamp, // 时间 1234567890987
				phone_type: 3, // 1 iOS 2 android 3 web 1 和 2 微信开发者支付 3微信公众号支付 4微信小程序支付
				device: 'web', // 设备名称
			}
		}
		data = Object.assign(data, obj)
		data = util.sign(data);
	}
	// 判断给服务端传递undefined的问题
	return new Promise((resolve, reject) => {
		if (loading) {
			wx.showLoading({
				icon: 'loading'
			})
		}
		wx.request({
			url: mumu_url_host + url,
			method: method ? method : 'GET',
			header: {
				'Accept': 'application/json',
				'Authorization': Authorization
			},
			data: data,
			success: (res) => {
				if (res.statusCode === 200) {
					if (res.data.hasOwnProperty("code")) {
						if (res.data.code == 0) {
							resolve(res.data)
							wx.hideLoading()
						} else {
							if (res.data.code == 211) { // 验证失败（例如：token过期）就返回211，请求头中没有token也返回211,拿到状态码为211，就清除token信息并跳转到登录页面
								wx.removeStorageSync('mumu_userinfo');
								wx.removeStorageSync('Authorization');
								wx.showModal({
									title: '提示',
									content: '登录过期！',
									showCancel: false,
									success(res) {
										if (res.confirm) {
											wx.reLaunch({
												url: '/pages/index/index?type=order',
											})
										}
									}
								})
								wx.hideLoading()
								return
							}
							wx.showModal({
								title: '提示',
								content: res.data.message,
								showCancel: false
							})
							wx.hideLoading()
							return
						}
					} else {
						resolve(res)
						wx.hideLoading()
					}
				} else {
					wx.showModal({
						title: '提示',
						content: res.data,
						showCancel: false
					})
					wx.hideLoading()
					reject(res.data)
				}
			},
			fail: function (err) {
				wx.showModal({
					title: '提示',
					content: err,
					showCancel: false
				})
				wx.hideLoading()
				reject(err)
			}
		})
	})
}

module.exports = {
    fetch,
	auth_fetch
}