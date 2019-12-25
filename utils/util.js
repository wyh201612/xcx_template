import md5 from 'md5.js';

/** 转换8888=>8.9K
 * @param {*} number
 */
const coutNum = (number) => {
    if (number > 1000 && number < 10000) {
        number = (number / 1000).toFixed(1) + 'k'
    }
    if (number > 10000) {
        number = (number / 10000).toFixed(1) + 'W'
    }
    return number
}

/** 判断是不是数字并且最多两位小数
 * @param {*} number
 */
const regNumber = (number) => {
    var reg = /(^[0-9]\d{0,3}$)|(^\.\d{1,2}$)|(^[0-9]\d{0,3}\.\d{1,2}$)/; //判断字符串是否为数字 ，判断正整数用/^[1-9]+[0-9]*]*$/
    if (!reg.test(number)) {
        return false;
    } else {
        return true;
    }
}

/** 格式化手机 137****9875
 * @param {*} phone
 */
const reg = (phone) => {
    var tel = phone;
    tel = "" + tel;
    var reg = /(\d{3})\d{4}(\d{4})/;
    let tel1 = tel.replace(reg, "$1****$2")
    return tel1
}

/** 当前时间
 * @param {*} nowTime
 */
const nowTime = () => {
    var date = new Date();
    var year = date.getFullYear(); //获取当前年份
    var mon = date.getMonth() + 1; //获取当前月份
    var da = date.getDate(); //获取当前日
    var day = date.getDay(); //获取当前星期几
    var h = date.getHours(); //获取小时
    var m = date.getMinutes(); //获取分钟
    var s = date.getSeconds(); //获取秒
    // 当分秒不足10时，前面加0
    if (m < 10) {
        var mm = "0" + m;
    } else {
        mm = m;
    }
    if (s < 10) {
        var ss = "0" + s;
    } else {
        ss = s;
    }
    if (day === 1) {
        var week = "一";
    } else if (day === 2) {
        week = "二";
    } else if (day === 3) {
        week = "三";
    } else if (day === 4) {
        week = "四";
    } else if (day === 5) {
        week = "五";
    } else if (day === 6) {
        week = "六";
    } else if (day === 7) {
        week = "日";
    }
    return year + "年" + mon + '月' + da + '日' + " " + '星期' + week + ' ' + h + ':' + mm + ':' + ss;
}

/** 日期格式转时间戳
 * @param {*} nowTime
 */
const formatDate1 = (nowTime) => {
    var date = new Date(nowTime);
    date = date.getTime();
    date = date / 1000
    console.log(date);
    return date
}

/** 时间格式化====时间戳转日期格式
 * @param {*} timeStamp
 * @param {*} type 字符
 * @param {*} auto 布尔
 */
const formatDate2 = (timeStamp, type = 'Y-M-D H:I:S', auto = false) => {
    let time = (timeStamp + '').length === 10 ? new Date(parseInt(timeStamp) * 1000) : new Date(parseInt(timeStamp));
    let _year = time.getFullYear();
    let _month = (time.getMonth() + 1) < 10 ? '0' + (time.getMonth() + 1) : (time.getMonth() + 1);
    let _date = time.getDate() < 10 ? '0' + time.getDate() : time.getDate();
    let _hours = time.getHours() < 10 ? '0' + time.getHours() : time.getHours();
    let _minutes = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
    let _secconds = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds();
    let formatTime = '';
    let distinctTime = new Date().getTime() - time.getTime();

    if (auto) {
        if (distinctTime <= (1 * 60 * 1000)) {
            // console.log('一分钟以内，以秒数计算');
            let _s = Math.floor((distinctTime / 1000) % 60);
            formatTime = _s + '秒前';
        } else if (distinctTime <= (1 * 3600 * 1000)) {
            // console.log('一小时以内,以分钟计算');
            let _m = Math.floor((distinctTime / (60 * 1000)) % 60);
            formatTime = _m + '分钟前';
        } else if (distinctTime <= (24 * 3600 * 1000)) {
            // console.log('一天以内，以小时计算');
            let _h = Math.floor((distinctTime / (60 * 60 * 1000)) % 24);
            formatTime = _h + '小时前';
        } else if (distinctTime <= (30 * 24 * 3600 * 1000)) {
            let _d = Math.floor((distinctTime / (24 * 60 * 60 * 1000)) % 30);
            formatTime = _d + '天前';
            // console.log('30天以内,以天数计算');
        } else {
            // 30天以外只显示年月日
            formatTime = _year + '-' + _month + '-' + _date;
        }
    } else {

        switch (type) {
            case 'Y-M-D H:I:S':
                formatTime = _year + '-' + _month + '-' + _date + ' ' + _hours + ':' + _minutes + ':' + _secconds;
                break;
            case 'Y-M-D H:I:S zh':
                formatTime = _year + '年' + _month + '月' + _date + '日  ' + _hours + ':' + _minutes + ':' + _secconds;
                break;
            case 'Y-M-D H:I':
                formatTime = _year + '-' + _month + '-' + _date + ' ' + _hours + ':' + _minutes;
                break;
            case 'Y-M-D H':
                formatTime = _year + '-' + _month + '-' + _date + ' ' + _hours;
                break;
            case 'Y-M-D':
                formatTime = _year + '-' + _month + '-' + _date;
                break;
            case 'Y-M-D zh':
                formatTime = _year + '年' + _month + '月' + _date + '日';
                break;
            case 'Y-M':
                formatTime = _year + '-' + _month;
                break;
            case 'Y':
                formatTime = _year;
                break;
            case 'M':
                formatTime = _month;
                break;
            case 'D':
                formatTime = _date;
                break;
            case 'H':
                formatTime = _hours;
                break;
            case 'I':
                formatTime = _minutes;
                break;
            case 'S':
                formatTime = _secconds;
                break;
            default:
                formatTime = _year + '-' + _month + '-' + _date + ' ' + _hours + ':' + _minutes + ':' + _secconds;
                break;
        }
    }
    // 返回格式化的日期字符串
    return formatTime;
}

/** 显示倒计时
 * @param {*} seconds
 */
const formatTime = (seconds) => {
    var min = Math.floor(seconds / 60),
        second = seconds % 60,
        day, hour, newHour, newMin, time;

    if (min > 60) {
        hour = Math.floor(min / 60);
        newMin = min % 60;
    }

    if (hour > 24) {
        day = Math.floor(hour / 24);
        newHour = hour % 24;
    }

    if (hour < 10) {
        hour = '0' + hour;
    }
    if (second < 10) {
        second = '0' + second;
    }
    if (newMin < 10) {
        newMin = '0' + newMin;
    }
    if (min < 10) {
        min = '0' + min;
    }

    if (day) {
        return (day + '天 ' + newHour + ':' + newMin + ':' + second);
    } else {
        return hour ? (hour + ':' + newMin + ':' + second) : (min + ':' + second);
    }

    // return time = hour? (hour + ':' + newMin + ':' + second) : (min + ':' + second);
}

/** 转FormData格式
 * @param {*} obj
 * @param {*} form
 * @param {*} namespace
 */
const objectToFormData = (obj, form, namespace) => {
    var fd = form || new FormData();
    let formKey;

    for (var property in obj) {
        if (obj.hasOwnProperty(property)) {
            let key = Array.isArray(obj) ? '[]' : `[${property}]`;
            if (namespace) {
                formKey = namespace + key;
            } else {
                formKey = property;
            }

            // if the property is an object, but not a File, use recursivity.
            if (typeof obj[property] === 'object' && !(obj[property] instanceof File)) {
                objectToFormData(obj[property], fd, formKey);
            } else {

                // if it's a string or a File object
                fd.append(formKey, obj[property]);
            }

        }
    }

    return fd;

}
/**
 *  ASCLL码加密
 * @export
 * @param {*} inputArr
 * @param {*} sort_flags
 * @returns
 */
const ksort = (inputArr, sort_flags) => {

    var tmp_arr = {},
        keys = [],
        sorter, i, k, that = this,
        strictForIn = false,
        populateArr = {};

    switch (sort_flags) {
        case 'SORT_STRING':
            // compare items as strings
            sorter = function(a, b) {
                return that.strnatcmp(a, b);
            };
            break;
        case 'SORT_LOCALE_STRING':
            // compare items as strings, original by the current locale (set with  i18n_loc_set_default() as of PHP6)
            var loc = this.i18n_loc_get_default();
            sorter = this.php_js.i18nLocales[loc].sorting;
            break;
        case 'SORT_NUMERIC':
            // compare items numerically
            sorter = function(a, b) {
                return ((a + 0) - (b + 0));
            };
            break;
            // case 'SORT_REGULAR': // compare items normally (don't change types)
        default:
            sorter = function(a, b) {
                var aFloat = parseFloat(a),
                    bFloat = parseFloat(b),
                    aNumeric = aFloat + '' === a,
                    bNumeric = bFloat + '' === b;
                if (aNumeric && bNumeric) {
                    return aFloat > bFloat ? 1 : aFloat < bFloat ? -1 : 0;
                } else if (aNumeric && !bNumeric) {
                    return 1;
                } else if (!aNumeric && bNumeric) {
                    return -1;
                }
                return a > b ? 1 : a < b ? -1 : 0;
            };
            break;
    }

    // Make a list of key names
    for (k in inputArr) {
        if (inputArr.hasOwnProperty(k)) {
            keys.push(k);
        }
    }
    keys.sort(sorter);

    // BEGIN REDUNDANT
    let php_js = {
        'ini': {}
    };

    // END REDUNDANT
    strictForIn = php_js.ini['phpjs.strictForIn'] && php_js.ini['phpjs.strictForIn'].local_value && php_js
        .ini['phpjs.strictForIn'].local_value !== 'off';
    populateArr = strictForIn ? inputArr : populateArr;

    // Rebuild array with sorted key names
    for (i = 0; i < keys.length; i++) {
        k = keys[i];
        tmp_arr[k] = inputArr[k];
        if (strictForIn) {
            delete inputArr[k];
        }
    }
    for (i in tmp_arr) {
        if (tmp_arr.hasOwnProperty(i)) {
            populateArr[i] = tmp_arr[i];
        }
    }

    return strictForIn || populateArr;
}
/**
 *  sign码加密
 * @export
 * @param {*} data
 * @returns
 */
const sign = data => {
    data = ksort(data);
    let string = '';
    for (let key in data) {
		if (isArrayFn(data[key])){
			data[key] = JSON.stringify(data[key])
		}
        string = string + key + data[key];
		if (key == 'value') {
			if (!isArrayFn(data[key])) {
				data[key] = JSON.parse(data[key])
			}
		}
    }
    let sign = md5(md5('aovnai' + string + 'webMDAwMD1AkbvwMDAwtMIJ7hZ'));
    data._sign = sign;
    return data
}
// 判断对象是不是数组的方法
function isArrayFn(value) {
	if (typeof Array.isArray === "function") {
		return Array.isArray(value);
	} else {
		return Object.prototype.toString.call(value) === "[object Array]";
	}
}
/**
 *  sign码加密 门店跳过来获取微信小程序秘钥
 * @export
 * @param {*} data
 * @returns
 */
const signWeiXin = data => {
    data = ksort(data);
    let string = '';
    for (let key in data) {
        string = string + key + data[key];
    }
    let sign = md5(md5('weixin' + string + 'weixinAwMD1AkbvwMDAwtMIJ7hZ'));
    data._sign = sign;
    return data
}


/**
 * 手机号
 * @param {*} phone
 */
const isPhone = phone => {
    const re = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
    return re.test(phone)
}

/**
 * 随机数
 * @param {*} len
 */
const random_string = len => {
    len = len || 32;
    var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var maxPos = chars.length;
    var pwd = '';
    for (let i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}
/**
 * 将腾讯/高德地图经纬度转换为百度地图经纬度
 * @param {*} lng
 * @param {*} lat
 */
const qqMapTransBMap = (lng, lat) => {
    let x_pi = 3.14159265358979324 * 3000.0 / 180.0;
    let x = lng;
    let y = lat;
    let z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
    let theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
    let lngs = z * Math.cos(theta) + 0.0065;
    let lats = z * Math.sin(theta) + 0.006;

    return {
        lng: lngs,
        lat: lats
    }
}
/**
 * 将百度地图经纬度转换为腾讯/高德地图经纬度
 * @param {*} lng
 * @param {*} lat
 */
const bMapTransQQMap = (lng, lat) => {
    let x_pi = 3.14159265358979324 * 3000.0 / 180.0;
    let x = lng - 0.0065;
    let y = lat - 0.006;
    let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
    let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
    let lngs = z * Math.cos(theta);
    let lats = z * Math.sin(theta);

    return {
        lng: lngs,
        lat: lats
    }
}

/* 
 7  * formatMoney(s,type) 2000=>2,000.00
 8  * 功能：金额按千位逗号分隔
 9  * 参数：s，需要格式化的金额数值. 
10  * 参数：type,判断格式化后的金额是否需要小数位. 
11  * 返回：返回格式化后的数值字符串. 
12  */
const formatMoney = (s, type) => {
    if (/[^0-9\.]/.test(s))
        return "0.00";
    if (s == null || s == "null" || s == "")
        return "0.00";
    s = s.toString().replace(/^(\d*)$/, "$1.");
    s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1");
    s = s.replace(".", ",");
    var re = /(\d)(\d{3},)/;
    while (re.test(s))
        s = s.replace(re, "$1,$2");
    s = s.replace(/,(\d\d)$/, ".$1");
    if (type == 0) {
        var a = s.split(".");
        if (a[1] == "00") {
            s = a[0];

        }
    }
    return s;
}
/* 
 * formatMoneyFan(money) 2,000.00=>2000.00
 * 功能：金额按千位逗号分隔
 * 参数：money，需要格式化的金额数值.
 * 返回：返回格式化后的数值字符串. 
 */
const formatMoneyFan = (money) => {
    var v;
    v = money.replace(/,/g, "");
    return v
}

var chnNumChar = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
var chnUnitSection = ["", "万", "亿", "万亿", "亿亿"];
var chnUnitChar = ["", "十", "百", "千"];

const numToChn = (num) => {
    var index = num.toString().indexOf(".");
    if (index != -1) {
        var str = num.toString().slice(index);
        var a = "点";
        for (var i = 1; i < str.length; i++) {
            a += chnNumChar[parseInt(str[i])];
        }
        return a;
    } else {
        return;
    }
}

//定义在每个小节的内部进行转化的方法，其他部分则与小节内部转化方法相同
const sectionToChinese = (section) => {
    var str = "",
        chnstr = "",
        zero = false,
        count = 0; //zero为是否进行补零， 第一次进行取余由于为个位数，默认不补零
    while (section > 0) {
        var v = section % 10; //对数字取余10，得到的数即为个位数
        if (v == 0) {
            //如果数字为零，则对字符串进行补零
            if (zero) {
                zero = false; //如果遇到连续多次取余都是0，那么只需补一个零即可
                chnstr = chnNumChar[v] + chnstr;
            }
        } else {
            zero = true; //第一次取余之后，如果再次取余为零，则需要补零
            str = chnNumChar[v];
            str += chnUnitChar[count];
            chnstr = str + chnstr;
        }
        count++;
        section = Math.floor(section / 10);
    }
    return chnstr;
}

//定义整个数字全部转换的方法，需要依次对数字进行10000为单位的取余，然后分成小节，按小节计算，当每个小节的数不足1000时，则需要进行补零
const TransformToChinese = (num) => {
    var a = numToChn(num);
    num = Math.floor(num);
    var unitPos = 0;
    var strIns = "",
        chnStr = "";
    var needZero = false;

    if (num === 0) {
        return chnNumChar[0];
    }
    while (num > 0) {
        var section = num % 10000;
        if (needZero) {
            chnStr = chnNumChar[0] + chnStr;
        }
        strIns = sectionToChinese(section);
        strIns +=
            section !== 0 ?
            chnUnitSection[unitPos] :
            chnUnitSection[0];
        chnStr = strIns + chnStr;
        needZero = section < 1000 && section > 0;
        num = Math.floor(num / 10000);
        unitPos++;
    }

    return chnStr;
}

module.exports = {
    coutNum: coutNum,
    regNumber: regNumber,
    reg: reg,
    formatDate1: formatDate1,
    formatDate2: formatDate2,
    nowTime: nowTime,
    formatTime: formatTime,
    objectToFormData: objectToFormData,
    sign: sign,
    signWeiXin: signWeiXin,
    isPhone: isPhone,
    random_string: random_string,
    qqMapTransBMap: qqMapTransBMap,
    bMapTransQQMap: bMapTransQQMap,
    formatMoney: formatMoney,
    formatMoneyFan: formatMoneyFan,
    TransformToChinese: TransformToChinese
}