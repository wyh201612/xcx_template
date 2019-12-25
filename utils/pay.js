import md5 from 'md5.js';

// 微信原生支付方法
const pay = (params, successData, cancelPay) => {
    let _this = this;
    let appid = params.appid;
	let noncestr = params.noncestr;
    let timeStamp = params.timestamp;
    let key = params.key;
	let prepayid = 'prepay_id=' + params.prepayid;
	let paySign = md5('appId=' + appid + '&nonceStr=' + noncestr + '&package=' + prepayid + '&signType=MD5&timeStamp=' + timeStamp + '&key=' + key).toLocaleUpperCase(); // md5加密签名
    // 微信支付
    wx.requestPayment({
        timeStamp: timeStamp, //时间戳，自1970年以来的秒数
        nonceStr: noncestr, //随机串
		package: prepayid, //统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=***
        signType: 'MD5', //签名算法
        paySign: paySign, //微信签名
        success(res) {
            if (res.errMsg == 'requestPayment:ok') {
                successData(res)
            }
        },
        fail(res) {
            let text = '';
            if (res.errMsg == 'requestPayment:fail cancel') {
				text = '支付已被取消'
				cancelPay(res)
            } else {
                text = '支付失败'
            }
            wx.showToast({
                title: text,
                icon: 'none',
                duration: 2000
            })
        }
    })
}

module.exports = {
    pay: pay
}