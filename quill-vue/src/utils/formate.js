// 移除数组中某个元素
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

Date.prototype.addTime = function(strInterval, Number) {
    var dtTmp = this;
    switch (strInterval) {
        case 's':
            return new Date(Date.parse(dtTmp) + 1000 * Number);
        case 'n':
            return new Date(Date.parse(dtTmp) + 60000 * Number);
        case 'h':
            return new Date(Date.parse(dtTmp) + 3600000 * Number);
        case 'd':
            return new Date(Date.parse(dtTmp) + 86400000 * Number);
        case 'w':
            return new Date(Date.parse(dtTmp) + 86400000 * 7 * Number);
        case 'q':
            return new Date(dtTmp.getFullYear(), dtTmp.getMonth() + Number * 3, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
        case 'm':
            return new Date(dtTmp.getFullYear(), dtTmp.getMonth() + Number, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
        case 'y':
            return new Date(dtTmp.getFullYear() + Number, dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
    }
};
Date.prototype.day_mow = function() {
    var myDate = this;
    var str = '';
    var Week = ['日', '一', '二', '三', '四', '五', '六'];
    str += '周' + Week[myDate.getDay()];
    return str;
};
Date.prototype.Format = function(fmt = 'yyyy/MM/dd hh:mm:ss') {
    //author: meizz
    var o = {
        'M+': this.getMonth() + 1, //月份
        'd+': this.getDate(), //日
        'h+': this.getHours(), //小时
        'm+': this.getMinutes(), //分
        's+': this.getSeconds(), //秒
        'q+': Math.floor((this.getMonth() + 3) / 3), //季度
        S: this.getMilliseconds(), //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    for (var k in o) if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
    return fmt;
};
