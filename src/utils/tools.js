import RootToast from 'react-native-root-toast';
// import './shim';
// import crypto from 'crypto';
import CryptoJS from 'crypto-js';
function Log(...params) {
    if (__DEV__) {
        // debug模式
        console.log(...params);
    } else {
        // release模式
        // Log('release模式');
    }
}
/**
 *
 * @param {String} msg 弹框信息
 * @param {String} position 位置 top|center|bottom
 */
function Toast(msg, position = RootToast.positions.BOTTOM) {
    // let toast = Toast.show('This is a message', {
    //     duration: Toast.durations.LONG, // toast显示时长
    //     position: Toast.positions.BOTTOM, // toast位置
    //     shadow: true, // toast是否出现阴影
    //     animation: true, // toast显示/隐藏的时候是否需要使用动画过渡
    //     hideOnPress: true, // 是否可以通过点击事件对toast进行隐藏
    //     delay: 0, // toast显示的延时
    //     onShow: () => {
    //         // toast出现回调（动画开始时）
    //     },
    //     onShown: () => {
    //         // toast出现回调（动画结束时）
    //     },
    //     onHide: () => {
    //         // toast隐藏回调（动画开始时）
    //     },
    //     onHidden: () => {
    //         // toast隐藏回调（动画结束时）
    //     }
    // });
    if (position === 'top') {
        position = RootToast.positions.TOP;
    } else if (position === 'center') {
        position = RootToast.positions.CENTER;
    } else if (position === 'bottom') {
        position = RootToast.positions.BOTTOM;
    }
    RootToast.show(msg, {
        duration: 2000,
        position,
        shadow: true,
        animation: true,
        hideOnPress: false,
        delay: 0,
    });
}
/**
 * 时间格式转化
 * @param {Date} time 需要转化的时间
 * @param {String} fmt 转化为什么yyyy-MM-dd格式
 * @returns {String} 转化后的时间
 */
function dateFormat(time, fmt) {
    let date = new Date(time);
    var o = {
        'M+': date.getMonth() + 1, //月份
        'd+': date.getDate(), //日
        'h+': date.getHours(), //小时
        'm+': date.getMinutes(), //分
        's+': date.getSeconds(), //秒
        'q+': Math.floor((date.getMonth() + 3) / 3), //季度
        S: date.getMilliseconds(), //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    for (var k in o) if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
    return fmt;
}
/**
 * 时间转化为多久以前
 * @param {Date} time 需要转化的时间
 * @returns {String} 5秒以前
 */
function dateBefor(Time) {
    'use static';
    const time = new Date(Time);
    const nowtime = new Date();
    let diff = nowtime.getTime() - time.getTime();
    if (diff / 1000 / 3600 / 24 / 30 / 12 > 1) {
        return `${Math.floor(diff / 1000 / 3600 / 24 / 30 / 12)}年前`;
    } else if (diff / 1000 / 3600 / 24 / 30 > 1) {
        return `${Math.floor(diff / 1000 / 3600 / 24 / 30)}个月前`;
    } else if (diff / 1000 / 3600 / 24 > 1) {
        return `${Math.floor(diff / 1000 / 3600 / 24)}天前`;
    } else if (diff / 1000 / 3600 > 1) {
        return `${Math.floor(diff / 1000 / 3600)}小时前`;
    } else {
        return '刚刚';
    }
}

/**
 * 报文加密
 * @param {Object} params 报文
 * @param {String} algorithm 算法规则 默认aes-256-cbc
 * @param {String} key 秘钥
 * @return {String} encrypted
 */
const encryptionDatagram = (params, key = '') => {
    let _key = CryptoJS.enc.Utf8.parse(key);
    let iv = CryptoJS.enc.Utf8.parse(_key + _key);
    var encrypted = CryptoJS.AES.encrypt(JSON.stringify(params), _key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    let _encrypted = encrypted.ciphertext.toString().toUpperCase();
    let res = decryptionDatagram(_encrypted, key);
    Log('decrypted', res, res.name);
    return _encrypted;
};
/**
 * 报文解密
 * @param {Object} encrypted 加密报文
 * @param {String} algorithm 算法规则 默认aes-256-cbc
 * @param {String} key 秘钥
 * @return {String} decrypted 解密报文
 */
const decryptionDatagram = (encrypted, key = '') => {
    key = CryptoJS.enc.Utf8.parse(key);
    let iv = CryptoJS.enc.Utf8.parse(key + key);
    var encryptedHexStr = CryptoJS.enc.Hex.parse(encrypted);
    var srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    var decrypted = CryptoJS.AES.decrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    let data = decrypted.toString(CryptoJS.enc.Utf8).toString();
    return JSON.parse(data);
};

global.Log = Log;
global.Toast = Toast;
global.Format = {
    dateBefor,
    dateFormat,
};
export { encryptionDatagram, decryptionDatagram };
