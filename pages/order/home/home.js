const app = getApp()
const http = require('../../../api/api.js')
import regeneratorRuntime from '../../../api/regeneratorRuntime.js'
Component({
    options: {
        addGlobalClass: true,
    },
    data: {
		wx_nickName: '',
		wx_avatar: '',
        nickname: '',
        icon: '',
		ali: '',
		phone: '',
		real_name: '',
        Authorization: '',
        experience: 0,
        balance: 0,
		orderCell: [
			{
				title: '待付款',
				img: '../../../images/my/1.png',
				url: '/orderHandling/orderHandling',
				id: 1,
				width: 40,
				height: 42
			}, {
				title: '待收货',
				img: '../../../images/my/3.png',
				url: '/orderHandling/orderHandling',
				id: 2,
				width: 44,
				height: 40
			}, {
				title: '退款/售后',
				img: '../../../images/my/5.png',
				url: '/orderHandling/orderHandling',
				id: 3,
				width: 44,
				height: 40
			}
		],
        list: [
			[{
				title: '收货地址',
				img: '../../../images/my/12.png',
				url: '/receivingAddress/receivingAddress',
				width: 46,
				height: 46
			}, {
				title: '完善资料',
				img: '../../../images/my/9.png',
				url: '/info/info',
				width: 46,
				height: 46
			}, {
				title: '商务合作',
				img: '../../../images/my/10.png',
				url: '/cooperation/cooperation',
				width: 46,
				height: 46
			}, {
				title: '商品收藏',
				img: '../../../images/my/7.png',
				url: '/collectionGoods/collectionGoods',
				width: 46,
				height: 46
			}],
            [{
                title: '关于我们',
                img: '../../../images/my/about_us.png',
				url: '/aboutus/aboutus',
				width: 40,
				height: 40
            }]
        ]
    },
    // 在组件实例刚刚被创建时执行，注意此时不能调用 setData111
    created() {},
    // 组件实例进入页面节点树时执行2222
    attached() {
		let _this = this;
		_this.setData({
			Authorization: wx.getStorageSync('Authorization')
		}, () => {
			if (_this.data.Authorization != '') {
				_this.get_userinfo();
			}
		})
	},
    // 在组件布局完成后执行3333
    ready() {
		
	},
    methods: {
        // 点击登录弹出登录授权框
        login() {
            this.setData({
                showAuth: true
            })
        },
		// 获取用户个人信息
		async get_userinfo() {
			let _this = this;
			let url = '/api2/myself/userinfo';
			let method = 'post';
			let header = {};
			let data = {};
			let loading = true;
			await http.auth_fetch(url, method, header, data, loading).then((res) => {
				wx.setStorageSync('mumu_userinfo', res.data);
				_this.setData({
					wx_nickName: wx.getStorageSync('userInfo').nickName,
					wx_avatar: wx.getStorageSync('userInfo').avatarUrl,
					experience: res.data.score,
					balance: res.data.balance,
					nickname: res.data.nickname,
					icon: res.data.icon,
					ali: res.data.ali,
					phone: res.data.phone,
					real_name: res.data.real_name
				})
			})
		},
        // 复制
        CopyLink(e) {
            wx.setClipboardData({
                data: e.currentTarget.dataset.link,
                success: res => {
                    wx.showToast({
                        title: '已复制',
                        duration: 1000,
                    })
                }
            })
        },
        // 显示二维码
        showQrcode() {
            wx.previewImage({
                urls: ['https://image.weilanwl.com/color2.0/zanCode.jpg'],
                current: 'https://image.weilanwl.com/color2.0/zanCode.jpg' // 当前显示图片的http链接      
            })
        },
        // 余额
        smallMoney() {
			if (this.data.Authorization == '') {
				this.login()
			} else {
				wx.navigateTo({
					url: '/pages/order/moneyBalance/moneyBalance?balance=' + this.data.balance + '&ali=' + this.data.ali + '&phone=' + this.data.phone + '&real_name=' + this.data.real_name,
				})
			}
        },
        toChild(e) {
            if (this.data.Authorization == '') {
                this.login()
            } else {
                wx.navigateTo({
                    url: '/pages/order' + e.currentTarget.dataset.url + '?id=' + e.currentTarget.dataset.id + '&title=' + e.currentTarget.dataset.title
                })
            }
        },
        // 退出登录
        outLogin() {
            wx.showLoading({
                icon: 'loading'
            })
            setTimeout(() => {
                wx.hideLoading()
                wx.clearStorage()
                const pages = getCurrentPages()[getCurrentPages().length - 1]
                let type = {
                    type: app.globalData.type
                }
                pages.onLoad(type)
            }, 600)
        }
	},
	pageLifetimes: {
		show: function () {
			if (app.globalData.updata) {
				this.get_userinfo();
			}
		}
	}
})