const app = getApp();
const http = require('../../../api/api.js')
import regeneratorRuntime from '../../../api/regeneratorRuntime.js'
Component({
    options: {
        addGlobalClass: true,
    },
    data: {
		loading: false,
        showAuth: false,
        StatusBar: app.globalData.StatusBar,
        CustomBar: app.globalData.CustomBar,
        isEdit: false,
        isAllChecked: false,
        loadModal: false,
		totalCount: 0, // 总数量
		totalPrice: 0.00, // 总价格
        shopcar_list: [],
        result: [] // 商品选择添加car_id
    },
    ready: function() {
        if (wx.getStorageSync('Authorization')) {
            this.shopcar_list_fetch(0);
        } else {
            this.setData({
                showAuth: true
            })
        }
    },
    methods: {
        /**
         *  购物车列表
         * @export
         * @param {*} type 控制加减时选中的还是被选中；0初始化。1加减操作
         * @returns
         */
		async shopcar_list_fetch(type) {
            let _this = this;
            let url = '/api/v1/shopcar/list';
            let method = 'post';
            let header = {};
            let data = {};
            let loading = true;
            await http.fetch(url, method, header, data, loading).then((res) => {
				if(type==0){
					res.data.forEach((item) => {
						item.checked = false
						item.value.forEach((item2) => {
							item2.checked = false
						})
					})
					_this.setData({
						shopcar_list: res.data,
						loading: true
					})
				}
            })
        },
        /**
         *  购物车商品数量加减接口
         * @export
         * @param {*} car_id 购物车ID
         * @param {*} type 操作类型 1加 2减
         * @param {*} num 操作类型 修改的数量(type==1或type==2是默认填写1)
         * @returns
         */
		async modified_quantity_fetch(car_id, type, num) {
            let _this = this;
            let url = '/api/v1/shopcar/modified_quantity';
            let method = 'post';
            let header = {};
            let data = {
                car_id: car_id,
                type: type,
				num: num
            };
            let loading = true;
            await http.fetch(url, method, header, data, loading).then((res) => {
                _this.shopcar_list_fetch(1);
            })
        },
        /**
         *  删除购物车商品
         * @export
         * @param {*} car_id 购物车ID
         * @returns
         */
        async shopcar_del_fetch(car_id) {
            let _this = this;
            let url = '/api/v1/shopcar/del';
            let method = 'post';
            let header = {};
            let data = {
                car_id: car_id
            };
            let loading = true;
            await http.fetch(url, method, header, data, loading).then((res) => {
                wx.showToast({
                    title: '已成功删除所选商品',
                    icon: 'success',
                    duration: 2000
                })
				_this.setData({
					totalCount: 0,
					totalPrice: 0
				})
                _this.shopcar_list_fetch(0);
            })
        },
        // 点击单个商店全选
        bindAllItemCheckbox(e) {
            let {
                id,
                index,
                ischecked
            } = e.currentTarget.dataset;
            let checked = `shopcar_list[${index}].checked`;
            let shopcar_list_item = `shopcar_list[${index}].value`;
            let sum = 0;
            let chenk = 0;
            // 点击的商店，选中商店
            this.setData({
                [checked]: !this.data.shopcar_list[index].checked
            }, () => {
                var result = this.data.result;
                this.data.shopcar_list[index].value.forEach((item) => {
                    // 如果商店选中,则商店下面的所有商品全部选中，否则全部不选中
                    if (this.data.shopcar_list[index].checked) { // 
                        item.checked = true;
                        // 选中商店进行添加car_id到result数组里面
                        let newA = [];
                        if (item.checked == true) {
                            // 当选中商品相同时，做数据去重操作，把newA赋值给result
                            let car_ids = this.data.result.concat(item.car_id);
                            car_ids.forEach(key => {
                                if (newA.indexOf(key) < 0) { //遍历newA是否存在key，如果存在key会大于0就跳过push的那一步
                                    newA.push(key);
                                }
                            });
                        }
                        this.setData({
                            result: newA
                        })
                    } else {
                        item.checked = false;
                        // 取消选中商店，商店下面的商品car_id在result数组中移除
                        result.forEach(item2 => {
                            if (item.car_id == item2) {
                                var item2index = result.indexOf(item2);
                                if (item2index > -1) {
                                    result.splice(item2index, 1);
                                }
                            }
                        });
                        this.setData({
                            result: result
                        })
                    }
                })

                // 是否商品全部选中，全部选中，则全选按钮选中，否则全选按钮不选中
                for (let i = 0; i < this.data.shopcar_list.length; i++) {
                    for (let j = 0; j < this.data.shopcar_list[i].value.length; j++) {
                        sum++;
                        // 判断是否为true
                        if (this.data.shopcar_list[i].value[j].checked) {
                            chenk++;
                        }
                    }
                }
                if (sum == chenk) {
                    console.log('相等都为true');
                    this.setData({
                        isAllChecked: true,
                    })
                } else {
                    console.log('不相等');
                    this.setData({
                        isAllChecked: false,
                    })
                }
                // 是否商品全部选中，全部选中，则全选按钮选中，否则全选按钮不选中--------------end

                this.setData({
                    [shopcar_list_item]: this.data.shopcar_list[index].value
                }, () => {
					this.calculateTotal();
                    console.log('car_id:',this.data.result)
                })
            })
        },
        // 点击单个商品选中
        bindCheckbox(e) {
            let {
                id,
				merchants_id,
                index,
                index1,
                ischecked
            } = e.currentTarget.dataset;
			let sum = 0;
			let chenk = 0;
			let sum2 = 0;
			let chenk2 = 0;
            let shopcar_list_item = `shopcar_list[${index}].value`;
            let checked0 = `shopcar_list[${index1}].checked`;
            let checked = `shopcar_list[${index1}].value[${index}].checked`;
            this.setData({
                [checked]: !this.data.shopcar_list[index1].value[index].checked
            }, () => {
                if (this.data.shopcar_list[index1].value[index].checked) {
                    let newA = [];
                    // 当选中商品相同时，做数据去重操作，把newA赋值给result
                    let car_ids = this.data.result.concat(id);
                    car_ids.forEach(key => {
                        if (newA.indexOf(key) < 0) { //遍历newA是否存在key，如果存在key会大于0就跳过push的那一步
                            newA.push(key);
                        }
                    });
                    this.setData({
                        result: newA
                    }, () => {
						console.log('car_id:',this.data.result)
                    })
                } else {
                    let result = this.data.result;
                    result.forEach(item2 => {
                        if (id == item2) {
                            if (result.indexOf(item2) > -1) {
                                result.splice(result.indexOf(item2), 1);
                            }
                        }
                    });

                    this.setData({
                        result: result
                    }, () => {
                        console.log('car_id:',this.data.result)
                    })
                }
                for (let i = 0; i < this.data.shopcar_list.length; i++) {
                    for (let j = 0; j < this.data.shopcar_list[i].value.length; j++) {
						if (this.data.shopcar_list[i].merchants_id == merchants_id) {
							sum++;
							// 判断是否为true
							if (this.data.shopcar_list[i].value[j].checked) {
								chenk++;
							}
						}
                    }
                }
                if (sum == chenk) {
                    console.log('相等都为true');
                    this.setData({
                        [checked0]: true
                    })
					for (let i = 0; i < this.data.shopcar_list.length; i++) {
						for (let j = 0; j < this.data.shopcar_list[i].value.length; j++) {
							sum2++
							if (this.data.shopcar_list[i].value[j].checked) {
								chenk2++
							}
						}
					}
					// 购物车存在多个商家的商品时，选择效果
					if (sum2 == chenk2) {
						this.setData({
							isAllChecked: true
						})
					} else {
						this.setData({
							isAllChecked: false
						})
					}
                } else {
                    console.log('不相等');
					this.setData({
						isAllChecked: false,
						[checked0]: false
					})
                }
				this.calculateTotal();
            })
        },
        // 点击全选选择
        allChecked() {
            var result = this.data.result;
            var isAllChecked = this.data.isAllChecked;
            isAllChecked = !isAllChecked;
            var shopcar_list = this.data.shopcar_list;
            if (isAllChecked) {
                for (var i = 0; i < shopcar_list.length; i++) {
                    shopcar_list[i].checked = isAllChecked;
                    for (var j = 0; j < shopcar_list[i].value.length; j++) {
                        shopcar_list[i].value[j].checked = isAllChecked;
						result.push(shopcar_list[i].value[j].car_id);
                    }
                }
            } else {
                for (var i = 0; i < shopcar_list.length; i++) {
                    shopcar_list[i].checked = isAllChecked;
                    for (var j = 0; j < shopcar_list[i].value.length; j++) {
                        shopcar_list[i].value[j].checked = isAllChecked;
                        result.forEach(item2 => {
                            if (shopcar_list[i].value[j].car_id == item2) {
                                var item2index = result.indexOf(item2);
                                if (item2index > -1) {
                                    result.splice(item2index, 1);
                                }
                            }
                        });
                    }
                }
            }
			this.setData({
				result: result,
				shopcar_list: this.data.shopcar_list,
				isAllChecked: isAllChecked
			}, () => {
				this.calculateTotal();
				console.log('car_id:', this.data.result)
			})
        },
        // 数量减
        bindMinus(e) {
            const {
				index1,
				index2,
				car_id,
				goods_num
            } = e.currentTarget.dataset;
            this.modified_quantity_fetch(car_id, 2,1);
			var shopcar_list = this.data.shopcar_list;
			var num = shopcar_list[index1].value[index2].num;
			shopcar_list[index1].value[index2].num--;
			this.setData({
				shopcar_list: shopcar_list
			});
			this.calculateTotal();
        },
        // 数量加
        bindPlus(e) {
            const {
				index1,
                index2,
                car_id
            } = e.currentTarget.dataset;
            this.modified_quantity_fetch(car_id, 1,1);
			var shopcar_list = this.data.shopcar_list;
			var num = shopcar_list[index1].value[index2].num;
			shopcar_list[index1].value[index2].num++;
			this.setData({
				shopcar_list: shopcar_list
			});
			this.calculateTotal();
        },
		// 商品数量输入框加减
		bindNumberInput(e) {
			let value = e.detail.value;
			let car_id = e.target.dataset.car_id;
			let index1 = e.target.dataset.index1;
			let index2 = e.target.dataset.index2;
			if (value == '' || value == 0) {
				value = 1;
			}
			this.modified_quantity_fetch(car_id, 3, value);
			var shopcar_list = this.data.shopcar_list;
			shopcar_list[index1].value[index2].num = value;
			this.setData({
				shopcar_list: shopcar_list
			});
			this.calculateTotal();
		},
        /**
         * 计算商品总数
         */
        calculateTotal() {
			var shopcar_list = this.data.shopcar_list;
            var totalCount = 0; // 总数量
			var totalPrice = 0; // 总价格
			for (var i = 0; i < shopcar_list.length; i++) {
				for (var j = 0; j < shopcar_list[i].value.length; j++) {
					var good = shopcar_list[i].value[j];
					if (good.checked) {
						totalCount += Number(good.num);
						totalPrice += Number(good.num) * good.price;
					}
				}
			}
            totalPrice = totalPrice.toFixed(2);
            this.setData({
                totalCount: totalCount,
                totalPrice: totalPrice
            },()=>{
				console.log('总数量：',this.data.totalCount)
				console.log('总价格：',this.data.totalPrice)
			})
        },
        // 结算商品
        settlement() {
            var str_car_id;
            let result = this.data.result;
            str_car_id = result.join(",");
            this.setData({
                loadModal: true
            })
            setTimeout(() => {
                this.setData({
                    loadModal: false
                })
                wx.navigateTo({
					url: '/pages/car/placeorder/placeorder?type=2' + '&goods_id=' + '&sku_id=' + '&car_id=' + str_car_id + '&num=' + '&address_id='
                })
            }, 1000)
        },
		// 编辑
		edit() {
			this.setData({
				isEdit: !this.data.isEdit
			});
		},
        // 删除商品
        delete() {
            let _this = this;
            var str_car_id;
            let result = this.data.result;
            str_car_id = result.join(",");
            wx.showModal({
                title: '提示',
                content: '确定将已选中的商品删除吗?',
                success(res) {
                    if (res.confirm) {
                        _this.shopcar_del_fetch(str_car_id);
                    }
                }
            })
        },
		toIndex() {
			wx.navigateTo({
				url: '/pages/index/index?type=home',
			})
		},
        // 跳转详情页
        toDetail(e) {
            let {
                goods_id,
            } = e.currentTarget.dataset;
            wx.navigateTo({
                url: '/pages/details/home/home?goods_id=' + goods_id
            })
            wx.setStorageSync('goods_id', goods_id)
        }
    }
});