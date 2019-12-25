const app = getApp()
const http = require('../../../api/api.js')
import regeneratorRuntime from '../../../api/regeneratorRuntime.js'
Component({
    options: {
        addGlobalClass: true,
    },
    data: {
        StatusBar: app.globalData.StatusBar,
        CustomBar: app.globalData.CustomBar,
        Custom: app.globalData.Custom,
        TabCur: 0,
		loading: false,
        class_list: [],
        class_id: 0,
        sort_type: 0,
        key_words: '',
        pageNum: 1,
        pagesize: 10,
        goods: [],
        isLoad: false,
        stopLoadMoreTiem: false //防止多次触发需要的变量
    },
    /**
     * 组件的对外属性
     */
    properties: {
        sort_type: {
            type: [Number, String],
            default: ''
        },
    },
    ready() {
        this.setData({
            sort_type: this.properties.sort_type
        }, () => {
            this.class_list_fetch(0)
            this.goods_list_fetch(this.data.class_id, this.data.sort_type, this.data.key_words, this.data.pageNum, this.data.pagesize);
        })
    },
    methods: {
		/**
         *  获取所有商品接口
         * @export
         * @param {*} class_id 分类ID
         * @param {*} sort_type 0 默认排序 1按照价格排序 2按照销量排序 3 按照时间排序
         * @param {*} key_words 搜索关键字 默认为空
         * @param {*} pageNum 当前页
         * @param {*} pagesize 每页显示条数
         * @returns
         */
		async goods_list_fetch(class_id, sort_type, key_words, pageNum, pagesize) {
			let _this = this;
			_this.setData({
				stopLoadMoreTiem: true
			})
			let url = '/api/v1/goods/list';
			let method = 'post';
			let header = {};
			let data = {
				class_id: class_id,
				sort_type: sort_type,
				key_words: key_words,
				pageNum: pageNum,
				pagesize: pagesize
			};
			let loading = true;
			await http.fetch(url, method, header, data, loading).then((res) => {
				var list = res.data.list;
				_this.setData({
					loading: true,
					goods: _this.data.goods.concat(list)
				}, () => {
					if (res.data.list.length >= 10) {
						_this.setData({
							stopLoadMoreTiem: false
						})
					} else {
						_this.setData({
							isLoad: true
						})
					}
				})
			})
		},
        /**
         *  获取商品分类接口
         * @export
         * @param {*} father_class_id 父级分类
         * @returns
         */
		async class_list_fetch(father_class_id) {
			let _this = this;
			let url = '/api/v1/home/class_list';
			let method = 'post';
			let header = {};
			let data = {
				father_class_id: father_class_id
			};
			let loading = true;
			await http.fetch(url, method, header, data, loading).then((res) => {
				let arr = {
					class_id: 0,
					class_name: "所以分类"
				}
				res.data.unshift(arr)
				_this.setData({
					class_list: res.data
				})
			})
		},
		// 输入框
        bindKeyInput(e) {
            this.setData({
                key_words: e.detail.value
            })
        },
        // 搜索
        search() {
            this.setData({
                goods: [],
                pageNum: 1,
            }, () => {
                this.goods_list_fetch(this.data.class_id, this.data.sort_type, this.data.key_words, this.data.pageNum, this.data.pagesize);
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
        },
        // class_id选择
        tabSelect(e) {
            let {
                id,
                class_id
            } = e.currentTarget.dataset;
            this.setData({
				isLoad: false,
				loading: false,
                TabCur: id,
                pageNum: 1,
                goods: [],
                class_id: class_id
            }, () => {
                this.goods_list_fetch(this.data.class_id, this.data.sort_type, this.data.key_words, this.data.pageNum, this.data.pagesize);
            })
        },
        // 滚动到底部/右边时触发
        lower(e) {
            if (this.data.stopLoadMoreTiem) {
                return;
            }
            this.setData({
                pageNum: this.data.pageNum + 1 //上拉到底时将page+1后再调取列表接口
            }, () => {
                this.goods_list_fetch(this.data.class_id, this.data.sort_type, this.data.key_words, this.data.pageNum, this.data.pagesize);
            });
        }
    }
})