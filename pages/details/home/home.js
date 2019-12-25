const app = getApp();
const http = require('../../../api/api.js')
import regeneratorRuntime from '../../../api/regeneratorRuntime.js'
const WxParse = require('../../../utils/wxParse/wxParse.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
		swiperCurrent: 0,
		windowW: app.globalData.windowWidth,
		windowH: app.globalData.windowHeight,
        StatusBar: app.globalData.StatusBar,
        CustomBar: app.globalData.CustomBar,
        title: [{
            name: '商品',
            id: 0
        }, {
            name: '详情',
            id: 1
        }],
        load: true,
        sign_up: [{}, {}, {}], // 奖池贡献
		user_id: '',
        goods_id: '',
        merchants_id: '',
        goods_detail: {},
        sku_info: {},
        sku_price: '', // sku价格
        stock_num: '', // 商品总剩余数
        sku_num: '', // sku剩余数
        sku_id: 0, // sku_id
        history_win: {}, // 历史免单名单
        activity_signup: {},
        merchants: {},
        merchants_activity: {}, // 活动总览
        TabCur: 0,
		MainCur: 0,
        HeaderTabCur: 0,
        offlineStoreHeight: '', // 线下门店弹框高度
        showOverlay: false, // 遮罩
        showOfflineStore: false, // 线下门店显示
        goodsTypeHeight: '', // 商品类型弹框高度
        showGoodsType: false, // 商品类型显示
        showShare: false, // 分享显示
        shareHeight: '', // 分享弹框高度
		showhaibao: false, // 海报显示
		maskHidden: true, // canvas显示
		shareImg: [], // 海报图片
		erweima: '', // 海报二维码
		article: '', // 商品详情
        payOrCar: '', // 1加入购物车 2立即支付
		sku: [], // sku商品规格
		sku_name: [], // 选中的商品规格
		num: 1 // 购买的数量
    },
	swiperChange: function (e) {
		this.setData({
			swiperCurrent: e.detail.current
		})
	},
    /**
     *  商品详情
     * @export
     * @param {*} goods_id 商品ID
     * @returns
     */
	async detail_fetch(goods_id) {
        let _this = this;
		_this.setData({
			user_id: wx.getStorageSync('mumu_userinfo') == '' || wx.getStorageSync('mumu_userinfo') == undefined ? '' : wx.getStorageSync('mumu_userinfo').user_id
		})
        let url = '/api/v1/goods/detail';
        let method = 'post';
        let header = {};
        let data = {
            goods_id: goods_id,
			user_id: _this.data.user_id
        };
        let loading = true;
        await http.fetch(url, method, header, data, loading).then((res) => {
            _this.setData({
                sku_price: res.data.goods_detail.price,
                stock_num: res.data.goods_detail.stock_num,
                sku_num: res.data.goods_detail.stock_num,
                goods_detail: res.data.goods_detail,
                activity_signup: res.data.activity_signup,
                history_win: res.data.history_win,
                merchants: res.data.merchants,
                merchants_activity: res.data.merchants_activity,
            })
			WxParse.wxParse('article', 'html', res.data.goods_detail.content, _this, 5);
        })
    },
    /**
     *  获取商品规格接口
     * @export
     * @param {*} goods_id 商品ID
     * @returns
     */
    async get_sku_fetch(goods_id) {
        let _this = this;
        let url = '/api/v1/shopgoods/get_sku';
        let method = 'post';
        let header = {};
        let data = {
            goods_id: goods_id
        };
        let loading = true;
        await http.fetch(url, method, header, data, loading).then((res) => {
            const arr = res.data.sku_data;
            const tempArr = []
            arr.map(res => {
                const obj = {
                    skuKey: res.skuKey,
                    skuValue: []
                }
                res.skuValue.map(item => {
                    const temp = {
                        value: item,
                        checked: false
                    }
                    obj.skuValue.push(temp)
                });
                tempArr.push(obj)
            });
            res.data.sku_data = tempArr;
            _this.setData({
                sku: res.data
            }, () => {
                // 获取sku弹窗高度
                _this.getGoodsTypeHeight();
                _this.setData({
                    showOverlay: true,
                    showGoodsType: true
                })
            })
        })
    },
    /**
     *  根据商品规格获取库存信息
     * @export
     * @param {*} goods_id 商品ID
     * @param {*} sku_name 属性集合 颜色:灰;容量:32G
     * @returns
     */
    async get_sku_info_fetch(goods_id, sku_name) {
        let _this = this;
        let url = '/api/v1/shopgoods/get_sku_info';
        let method = 'post';
        let header = {};
        let data = {
            goods_id: goods_id,
            sku_name: sku_name
        };
        let loading = true;
        await http.fetch(url, method, header, data, loading).then((res) => {
            _this.setData({
                num: 1,
                sku_info: res.data,
                sku_id: res.data.sku_id,
                sku_num: res.data.stock_num,
                sku_price: res.data.sku_price
            })
        })
    },
    /**
     *  根据商品规格获取库存信息
     * @export
     * @param {*} goods_id 商品ID
     * @param {*} sku_id 规格属性ID 没有规格的时候传0
     * @param {*} num 购买商品的数量
     * @returns
     */
	async add_shopcar_info_fetch(goods_id, sku_id, num) {
		let _this = this;
		let url = '/api/v1/shopcar/add';
		let method = 'post';
		let header = {};
		let data = {
			goods_id: goods_id,
			sku_id: sku_id,
			num: num
		};
		let loading = true;
		await http.fetch(url, method, header, data, loading).then((res) => {
			wx.showToast({
				title: '加入购物车成功',
				icon: 'success',
				duration: 2000
			})
			_this.setData({
				num: 1
			})
		})
	},
	/**
     *  商品收藏、商品取消收藏
     * @export
     * @param {*} goods_id 商品ID
     * @returns
     */
	async add_shopgoodscollect() {
		if (wx.getStorageSync('Authorization')) {
			let _this = this;
			let url = '';
			if (_this.data.goods_detail.is_collect == 1) { //是否收藏 0否 1是
				url = '/api/v1/shopgoodscollect/cancel';
			} else {
				url = '/api/v1/shopgoodscollect/add';
			}
			let method = 'post';
			let header = {};
			let data = {
				goods_id: _this.data.goods_id
			};
			let loading = true;
			await http.fetch(url, method, header, data, loading).then((res) => {
				let title = '';
				if (_this.data.goods_detail.is_collect == 1) { //是否收藏 0否 1是
					title = '取消收藏成功';
				} else {
					title = '添加收藏成功';
				}
				wx.showToast({
					title: title,
					icon: 'success',
					duration: 2000
				})
			})
			await _this.detail_fetch(_this.data.goods_id);
		} else {
			this.login();
		}
	},
	tabHeaderSelect(e) {
		this.setData({
			HeaderTabCur: e.currentTarget.dataset.id,
			MainCur: e.currentTarget.dataset.id
		})
	},
    VerticalMain(e) {
        let that = this;
        if (e.detail.scrollTop >= 50) {
            that.setData({
                bg: true
            })
        } else {
            that.setData({
                bg: false
            })
        }
        let title = that.data.title;
        let tabHeight = 0;
        if (that.data.load) {
            for (let i = 0; i < title.length; i++) {
                let view = wx.createSelectorQuery().select("#main-" + title[i].id);
                view.fields({
                    size: true
                }, data => {
                    title[i].top = tabHeight;
                    tabHeight = tabHeight + data.height;
                    title[i].bottom = tabHeight;
                }).exec();
            }
            that.setData({
                load: false,
                title: title
            })
        }
        let scrollTop = e.detail.scrollTop + that.data.CustomBar;
        for (let i = 0; i < title.length; i++) {
            if (scrollTop > title[i].top && scrollTop < title[i].bottom) {
                that.setData({
                    HeaderTabCur: title[i].id
                })
                return
            }
        }
    },
    // 获取线下门店弹窗高度
    getOfflineStorHeight() {
        let _this = this;
        var query = wx.createSelectorQuery();
        query.select('.showOfflineStore').boundingClientRect()
        query.exec(function(res) {
            _this.setData({
                offlineStoreHeight: res[0].height
            })
        })
    },
    // 获取商品类型弹窗高度
    getGoodsTypeHeight() {
        let _this = this;
        var query = wx.createSelectorQuery();
        query.select('.goodsType').boundingClientRect()
        query.exec(function(res) {
            _this.setData({
                goodsTypeHeight: res[0].height
            })
        })
    },
    // 获取商品类型弹窗高度
    getShareHeight() {
        let _this = this;
        var query = wx.createSelectorQuery();
        query.select('.share-box').boundingClientRect()
        query.exec(function(res) {
            _this.setData({
                shareHeight: res[0].height
            })
        })
    },
    // 线下门店显示
    showOfflineStore() {
        this.setData({
            showOverlay: true,
            showOfflineStore: true
        })
    },
    // 隐藏
    dialogHide() {
        this.setData({
            showOverlay: false,
            showOfflineStore: false,
            showGoodsType: false,
            showShare: false
        })
    },
	// 隐藏海报
	dialogHidehaibao() {
		this.setData({
			showhaibao: false,
		})
	},
    // 点击加入购物车立即支付显示商品类型
    showGoodsType(e) {
        let {
            type
        } = e.currentTarget.dataset;
        if (wx.getStorageSync('Authorization')) {
            this.setData({
                sku_name: [],
				sku_price: this.data.goods_detail.price,
				sku_num: this.data.stock_num,
				sku_id: 0,
                payOrCar: type
            })
            this.get_sku_fetch(this.data.goods_id);
        } else {
            this.login();
        }
    },
    // 分享显示
    showShare(e) {
        this.setData({
            showOverlay: true,
            showShare: true
        })
    },
    // 点击登录弹出登录授权框
    login() {
        this.setData({
            showAuth: true
        })
    },
    // 点击sku动态获取sku每个数据
    get_sku_info(event) {
        let _this = this;
        let str = '';
        let {
            index,
            sku_key,
            sku_value
        } = event.currentTarget.dataset;
        let _attributeList = _this.data.sku.sku_data;
        let sku_name = this.data.sku_name;
        let sku_data = `sku.sku_data`;
        for (let i = 0; i < _attributeList.length; i++) {
            if (_attributeList[i].skuKey === sku_key) {
                for (let j = 0; j < _attributeList[i].skuValue.length; j++) {
                    if (_attributeList[i].skuValue[j].value == sku_value) {
                        //如果已经选中，则反选
                        if (_attributeList[i].skuValue[j].checked) {
                            //sku_name是否存在相同类型的元素
                            for (let index = 0; index < sku_name.length; index++) {
                                const element = sku_name[index];
                                if (element.indexOf(_attributeList[i].skuKey) > -1) {
                                    sku_name.splice(index, 1);
                                }
                            }
                            _attributeList[i].skuValue[j].checked = false;
                        } else {
                            //sku_name是否存在相同类型的元素
                            for (let index = 0; index < sku_name.length; index++) {
                                const element = sku_name[index];
                                if (element.indexOf(_attributeList[i].skuKey) > -1) {
                                    sku_name.splice(index, 1);
                                }
                            }
                            //往sku_name添加元素
                            str = _attributeList[i].skuKey + ':' + _attributeList[i].skuValue[j].value;
                            // 数组指定位置插入元素
                            sku_name.splice(index, 0, str);
                            _attributeList[i].skuValue[j].checked = true;
                        }
                    } else {
                        _attributeList[i].skuValue[j].checked = false;
                    }
                }
            }
        }
        this.setData({
            sku_name: sku_name,
            [sku_data]: _attributeList
        });
        //重新计算spec改变后的信息
        if (sku_name.length == _attributeList.length) {
            this.get_sku_info_fetch(this.data.goods_id, sku_name.join(';'))
        } else {
            this.setData({
                sku_num: this.data.goods_detail.stock_num,
                sku_price: this.data.goods_detail.price
            })
        }
        //重新计算哪些值不可以点击,先不做
    },
    // 商品数量增加
    bindPlus(e) {
        let num = this.data.num;
        num++;
        this.setData({
            num: num
        })
    },
    // 商品数量减少
    bindMinus(e) {
        let num = this.data.num;
        num--;
        this.setData({
            num: num
        })
    },
	// 商品数量输入框加减
	bindNumberInput(e) {
		let num = e.detail.value;
		if (num == '' || num == 0) {
			num = 1
		}
		this.setData({
			num: num
		})
	},
    // 加入购物车、立即支付提交； payOrCar：1购物车、2立即支付
    submission() {
        // 判断sku是不是没有数据，如果没有直接加减数量直接支付，否则必须选择sku类型之后才能进行去支付
        let sku_id = this.data.sku_id;
        if (this.data.num == 0) {
            wx.showToast({
                title: '请选择商品数量！',
                icon: 'none',
                duration: 2000
            })
            return
        }
        if (this.data.payOrCar == 1) {
            if (this.data.sku.sku_data.length == 0) { // 没有规格
                this.setData({
                    showOverlay: false,
                    showOfflineStore: false,
                    showGoodsType: false
                })
                this.add_shopcar_info_fetch(this.data.goods_id, sku_id, this.data.num);
            } else { // 有规格
                if (this.data.sku_name.length == this.data.sku.sku_data.length) {
                    this.setData({
                        showOverlay: false,
                        showOfflineStore: false,
                        showGoodsType: false
                    })
                    this.add_shopcar_info_fetch(this.data.goods_id, sku_id, this.data.num);
                } else {
                    wx.showToast({
                        title: '请选择规格',
                        icon: 'none',
                        duration: 2000
                    })
                }
            }
        } else {
            if (this.data.sku.sku_data.length == 0) { // 没有规格
                this.setData({
                    showOverlay: false,
                    showOfflineStore: false,
                    showGoodsType: false
                })
                wx.navigateTo({
                    url: '/pages/car/placeorder/placeorder?type=1' + '&goods_id=' + this.data.goods_id + '&sku_id=' + sku_id + '&car_id=&num=' + this.data.num + '&address_id='
                })
            } else { // 有规格
                if (this.data.sku_name.length == this.data.sku.sku_data.length) {
                    this.setData({
                        showOverlay: false,
                        showOfflineStore: false,
                        showGoodsType: false
                    })
                    wx.navigateTo({
                        url: '/pages/car/placeorder/placeorder?type=1' + '&goods_id=' + this.data.goods_id + '&sku_id=' + sku_id + '&car_id=&num=' + this.data.num + '&address_id='
                    })
                } else {
                    wx.showToast({
                        title: '请选择规格',
                        icon: 'none',
                        duration: 2000
                    })
                }
            }
        }
    },
    // '活动总览','奖池贡献'切换
    tabSelect(e) {
        this.setData({
            TabCur: e.currentTarget.dataset.id
        })
    },
    // 历史免单展示
    binghistor() {
		if (wx.getStorageSync('Authorization')) {
			wx.navigateTo({
				url: '/pages/details/consumeHistoryList/consumeHistoryList?merchants_id=' + this.data.merchants.merchants_id,
			})
		} else {
			this.login();
		}
    },
    // 活动总览展示
    bingConsumeActivitys() {
		if (wx.getStorageSync('Authorization')) {
			wx.navigateTo({
				url: '/pages/details/consumeActivitys/consumeActivitys?merchants_id=' + this.data.merchants.merchants_id,
			})
		} else {
			this.login();
		}
    },
    // 奖池展示
    bingJackpot() {
		if (wx.getStorageSync('Authorization')) {
			wx.navigateTo({
				url: '/pages/details/consumeList/consumeList?merchants_id=' + this.data.merchants.merchants_id,
			})
		} else {
			this.login();
		}
    },
    // 点击购物车跳转到购物车
    toCar() {
        if (wx.getStorageSync('Authorization')) {
            wx.navigateTo({
                url: '/pages/index/index?type=car',
            })
        } else {
            this.login();
        }
    },
    // 点击商城跳到首页
    mall() {
        wx.navigateTo({
            url: '/pages/index/index?type=home',
        })
    },
    // 打电话
    callPhone(e) {
        var phone = e.currentTarget.dataset.ph;
        wx.makePhoneCall({
            phoneNumber: phone
        })
    },
    
	// canvas 文字断行和省略号显示
	dealWords: function (options) {
		options.ctx.setFontSize(options.fontSize);//设置字体大小
		//实际总共能分多少行
		var allRow = Math.ceil(options.ctx.measureText(options.word).width / options.maxWidth);
		var count = allRow >= options.maxLine ? options.maxLine : allRow;//实际能分多少行与设置的最大显示行数比，谁小就用谁做循环次数
		var endPos = 0;//当前字符串的截断点
		for (var j = 0; j < count; j++) {
			var nowStr = options.word.slice(endPos);//当前剩余的字符串
			var rowWid = 0;//每一行当前宽度    
			if (options.ctx.measureText(nowStr).width > options.maxWidth) {//如果当前的字符串宽度大于最大宽度，然后开始截取
				for (var m = 0; m < nowStr.length; m++) {
					rowWid += options.ctx.measureText(nowStr[m]).width;//当前字符串总宽度
					if (rowWid > options.maxWidth) {
						if (j === options.maxLine - 1) { //如果是最后一行
							options.ctx.fillText(nowStr.slice(0, m - 1) + '...', options.x, options.y + (j + 1) * 18);    //(j+1)*18这是每一行的高度        
						} else {
							options.ctx.fillText(nowStr.slice(0, m), options.x, options.y + (j + 1) * 18);
						}
						endPos += m;//下次截断点
						break;
					}
				}
			} else {//如果当前的字符串宽度小于最大宽度就直接输出
				options.ctx.fillText(nowStr.slice(0), options.x, options.y + (j + 1) * 18);
			}
		}
	},
	//将金额绘制到canvas的固定
	setMoney: function (context) {
		let goods_price = '￥' + this.data.goods_detail.price; // 商品价格
		context.setFontSize(20);
		context.setFillStyle("red");
		context.fillText(goods_price, 30, 385);
		context.stroke();
	},
	//将金额绘制到canvas的固定
	setMoney1: function (context) {
		let goods_price = '市场价：￥' + this.data.goods_detail.market_price; // 商品市场价价格
		context.setFontSize(16);
		context.setFillStyle("#666666");
		context.fillText(goods_price, 30, 355);
		context.stroke();
	},
	//将说明绘制到canvas固定
	setSuoming: function (context) {
		var Suoming = "木木商城小程序"
		context.font = 'normal bold 18px sans-serif';
		context.setFontSize(18);
		context.setFillStyle("#000000");
		context.fillText(Suoming, 40, 470);
		context.stroke();
	},
	//将说明2绘制到canvas固定
	setSuoming1: function (context) {
		var Suoming = "长按识别 去逛逛"
		context.setFontSize(14);
		context.setFillStyle("#484a3d");
		context.fillText(Suoming, 50, 510);
		context.stroke();
	},

	//将标题绘制到canvas的固定
	setName: function (context) {
		let goods_name = this.data.goods_detail.goods_name; // 商品名称
		const nameWidth = context.measureText(goods_name).width;
		this.dealWords({
			ctx: context,//画布上下文
			fontSize: 16,//字体大小
			word: goods_name,//需要处理的文字
			maxWidth: 315,//一行文字最大宽度
			x: 30,//文字在x轴要显示的位置
			y: 290,//文字在y轴要显示的位置
			maxLine: 2//文字最多显示的行数
		})
		context.stroke();
	},
	//获取小程序码
	geterweima() {
		var _this = this;
		wx.getImageInfo({
			src: "https://img.mumuhome.net/Upfiles/merchants/program/page353559900044922880.png", // 二维码
			success: res => {
				_this.setData({
					erweima: res.path
				})
			}
		})
	},
	//将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
	createNewImg: function () {
		var _this = this;
		const post_cover = _this.data.goods_detail.banner[0].pic;
		const erweima_cover = _this.data.erweima;
		var context = wx.createCanvasContext("mycanvas");
		wx.downloadFile({
			url: post_cover,//网络路径
			success: function (res3) {
				context.setFillStyle('#FFF');
				context.fillRect(0, 0, _this.data.windowW, _this.data.windowH);
				var path = res3.tempFilePath;
				var erweima_path = erweima_cover;
				context.drawImage(path, 30, 20, 315, 265);  //这里是商品图片
				_this.setSuoming(context);
				_this.setName(context);
				_this.setMoney1(context);
				_this.setMoney(context);
				_this.setSuoming1(context);
				context.drawImage(erweima_path, 195, 410, 150, 150);//这里是二维码图片
				//将生成好的图片保存到本地  在 draw 回调里调用canvasToTempFilePath方法才能保证图片导出成功。
				context.draw(false, () => {
					wx.canvasToTempFilePath({
						x: 0,
						y: 0,
						canvasId: 'mycanvas',  // mycanvas 为制定 绘图canvas 的ID
						success: (res) => {
							_this.setData({
								shareImg: res.tempFilePath,
								maskHidden: true
							})
							wx.hideToast();
						},
						complete: (res) => {
							wx.hideLoading()
						}
					})
				})
			}
		})
	},
	
	//点击图片进行预览，长按保存分享图片
	previewImg: function (e) {
		var img = this.data.shareImg;
		wx.previewImage({
			current: img, // 当前显示图片的http链接
			urls: [img] // 需要预览的图片http链接列表
		})
	},
	// 分享生成海报
	shareFrends: function (e) {
		if (wx.getStorageSync('Authorization')) {
			var _this = this
			this.setData({
				maskHidden: false,
				showhaibao: true
			})
			wx.showToast({
				title: '图片生成中...',
				icon: 'loading',
				duration: 2000
			});
			_this.createNewImg();
		} else {
			this.setData({
				showShare: false,
				showOverlay: false
			})
			this.login();
		}
	},
	
	// 保存海报事件
	saveImg() {
		let that = this;
		// 获取用户是否开启用户授权相册
		wx.saveImageToPhotosAlbum({
			filePath: that.data.shareImg,
			success() {
				wx.showToast({
					title: '保存成功'
				})
			},
			fail() {
				wx.showToast({
					title: '保存失败',
					icon: 'none'
				})
			}
		})
	},
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
		let _this = this
		this.geterweima()
        this.getShareHeight();
		setTimeout(()=>{
			_this.setData({
				goods_id: options.goods_id ? options.goods_id : wx.getStorageSync('goods_id')
			}, () => {
				_this.detail_fetch(_this.data.goods_id)
			})
		},300)
		this.getOfflineStorHeight();
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
		
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function(ops) {
		let _this = this;
        let goods_id = '';
        if (ops.from === 'button') {
            // 来自页面内转发按钮
            goods_id = ops.target.dataset.goods_id;
        } else {
            // 来自点击小程序顶部转发
            goods_id = wx.getStorageSync('goods_id');
        }
        console.log(goods_id)
        return {
			title: _this.data.goods_detail.goods_name,
            path: '/pages/details/home/home?goods_id=' + goods_id,
			imageUrl: _this.data.goods_detail.banner[0].pic, //用户分享出去的自定义图片大小为5:4,
            // imageUrl: 'https://img.mumuhome.net/mumu/logo.png', //用户分享出去的自定义图片大小为5:4,
            success: function(res) {
                // 转发成功
                console.log("转发成功:" + JSON.stringify(res));
            },
            fail: function(res) {
                // 转发失败
                console.log("转发失败:" + JSON.stringify(res));
            }
        }
    }
})