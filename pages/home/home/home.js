const http = require('../../../api/api.js')
import regeneratorRuntime from '../../../api/regeneratorRuntime.js'
const app = getApp();

Component({
    options: {
        addGlobalClass: true, // 需要外部wxss影响到组件的样式
    },
    data: {
		swiperCurrent: 0,
        currentIndex: 0, // class-item的currentIndex
		banner: [],
		shop_goods_class: [],
		adver: [],
		newbie_guide: [],
		new_goods: [],
		hot_goods: [],
		recommended_goods: [],
		latitude: '',
		longitude: ''
    },
    ready() {
		this.get_lat_lng();
    },
    methods: {
		swiperChange: function (e) {
			this.setData({
				swiperCurrent: e.detail.current
			})
		},
        // 每10个一组
        splitArray(N, Q) {
            var R = [],
                F;
            for (F = 0; F < Q.length;) {
                R.push(Q.slice(F, F += N))
            }
            return R
        },
        /**
         *  首页接口
         * @export
         * @returns
         */
		async homeIndex_fetch(latitude, longitude) {
            let _this = this;
            let url = '/api/v1/home/index';
            let method = 'post';
            let header = {};
            let data = {
				lng: longitude,
				lat: latitude
			};
            let loading = true;
            await http.fetch(url, method, header, data, loading).then((res) => {
                _this.setData({
                    banner: res.data.banner,
                    shop_goods_class: _this.splitArray(10, res.data.shop_goods_class),
                    adver: res.data.adver,
                    newbie_guide: res.data.newbie_guide,
					same_city_goods: res.data.same_city_goods,
                    new_goods: res.data.new_goods,
                    hot_goods: res.data.hot_goods,
                    recommended_goods: res.data.recommended_goods
                })
            })
        },
		/**
         *  获取经纬度
         * @export
         * @returns
         */
		async get_lat_lng() {
			let _this = this;
			wx.getLocation({
				type: 'gcj02', //返回可以用于wx.openLocation的经度
				success: (res) => {
					_this.homeIndex_fetch(res.latitude, res.longitude);
				},
			})
		},
		// 跳转到木木首页
		toMuMuHome() {
			console.log('跳转到木木首页')
		},
        onLoad() {
            let _this = this;
            // 获取用户信息
            wx.getSetting({
                success: res => {
                    if (!res.authSetting['scope.userInfo']) {
                        wx.redirectTo({
                            url: '/pages/auth/auth'
                        })
                    }
                }
            })
        },
        showModal(e) {
            this.setData({
                modalName: e.currentTarget.dataset.target
            })
        },
        hideModal(e) {
            this.setData({
                modalName: null
            })
        },
        // 搜索
        onSearch(e) {
            let key_words = e.detail;
            console.log(e)
            if (key_words == null) {
                wx.navigateTo({
                    url: '/pages/mall/allgoods/allgoods?is_hot=0' + '&is_recommend=0' + '&is_news=1' + '&sort_type=0' + '&key_words=' + '&class_id=0' + '&isSearch=true'
                })
            } else {
                wx.navigateTo({
                    url: '/pages/mall/allgoods/allgoods?is_hot=0' + '&is_recommend=0' + '&is_news=1' + '&sort_type=0' + '&key_words=' + key_words + '&class_id=0' + '&isSearch=true'
                })
            }
        },
		toSearch() {
			wx.navigateTo({
				url: '/pages/mall/search/search?focus=true'
			})
		},
        // 滑动切换class-item
        classCurrent(e) {
            this.setData({
                currentIndex: e.detail.current
            })
        },
        // 点击class-item每一项
        tapClass(e) {
            const {
                class_id,
                sort_title,
                index
            } = e.currentTarget.dataset;
            console.log('class_id', class_id)
            console.log('sort_title', sort_title)
            wx.navigateTo({
                url: '/pages/mall/allgoods/allgoods?is_hot=0' + '&is_recommend=0' + '&is_news=1' + '&sort_type=0' + '&key_words=' + '&class_id=' + class_id + '&sort_title=' + sort_title
            })
        },
        bindpic(e) {
			const {
				adv_id,
				url
			} = e.currentTarget.dataset;
			console.log('adv_id:', adv_id)
			console.log('url:', url)
        },
        // 跳转到加盟木木生意自然来（广告）
        toOtherad(e) {
			const {
				adv_id,
				url
			} = e.currentTarget.dataset;
			console.log('adv_id:', adv_id)
			console.log('url:', url)
            // let activity_id = url.split('=')[1];
            // if (activity_id != undefined) {
            // 	wx.navigateTo({
            // 		url: '/pages/activity/activity?activity_id=' + activity_id
            // 	})
            // } else {
            // 	wx.showToast({
            // 		title: '活动不存在',
            // 		icon: 'none',
            // 		duration: 2000
            // 	})
            // }
        },
        // 商品列表
        allgoods(e) {
            let {
				same_city,
                is_hot,
                is_recommend,
                is_news,
                sort_type,
                key_words,
                class_id
            } = e.currentTarget.dataset;
            wx.navigateTo({
				url: '/pages/mall/allgoods/allgoods?is_hot=' + is_hot + '&is_recommend=' + is_recommend + '&same_city=' + same_city + '&is_news=' + is_news + '&sort_type=' + sort_type + '&key_words=' + key_words + '&class_id=' + class_id
            })
        },
        toDetail(e) {
            let {
                goods_id,
            } = e.currentTarget.dataset;
            wx.navigateTo({
                url: '/pages/details/home/home?goods_id=' + goods_id
            })
            wx.setStorageSync('goods_id', goods_id)
        }
    },
})