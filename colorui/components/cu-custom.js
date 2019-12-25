const app = getApp();
Component({
    /**
     * 组件的一些选项
     */
    options: {
        addGlobalClass: true,
        multipleSlots: true
    },
    /**
     * 组件的对外属性
     */
    properties: {
        bgColor: {
            type: String,
            default: ''
        },
        isCustom: {
            type: [Boolean, String],
            default: false
        },
        isBack: {
            type: [Boolean, String],
            default: false
        },
		upData: {
			type: String,
			default: ''
		},
        bgImage: {
            type: String,
            default: ''
        },
		isOpacity: {
			type: [Boolean, String],
			default: false
		},
		opacity: {
			type: Number,
			default: 0
		},
    },
    /**
     * 组件的初始数据
     */
    data: {
        StatusBar: app.globalData.StatusBar,
        CustomBar: app.globalData.CustomBar,
        Custom: app.globalData.Custom
    },
    /**
     * 组件的方法列表
     */
    methods: {
        BackPage() {
			if (this.data.upData==1) { // 购物车支付取消进入订单列表，返回数据更新
				wx.redirectTo({
					url: '/pages/index/index?type=car',
				})
				return
			}
            wx.navigateBack({
                delta: 1
            });
        },
        toHome() {
            wx.reLaunch({
                url: '/pages/index/index',
            })
        }
    }
})