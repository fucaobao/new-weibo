var util = {
    isArray: function(value) {
        return Object.prototype.toString.call(value) === '[object Array]';
    },
    isObject: function(value) {
        return Object.prototype.toString.call(value) === '[object Object]';
    },
    //深拷贝
    clone: function(obj) {
        var newobj = obj.constructor === Array ? [] : {};
        if (typeof obj !== 'object') {
            return obj;
        } else if (JSON) {
            newobj = JSON.parse(JSON.stringify(obj)); //化对象和还原
        } else {
            for (var i in obj) {
                newobj[i] = typeof obj[i] === 'object' ? cloneObj(obj[i]) : obj[i];
            }
        }
        return newobj;
    },
    //深拷贝扩展
    extend: function(dest, src) {
        var self = this;
        for (var key in src) {
            if (src.hasOwnProperty(key)) {
                dest[key] = self(src[key]);
            }
        }
        return dest;
    },
    getOrigin: function(url) {
        var index = url.indexOf('?');
        if (index < 0) {
            return url;
        }
        return url.substring(0, index);
    }
};
module.exports = util;