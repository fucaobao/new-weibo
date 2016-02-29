var request = require('request');
var cheerio = require('cheerio');
var zlib = require('zlib');
var log = require('./lib/log'); 					//日志系统
var util = require('./lib/util');
var mail = require('./lib/mail');
var config = require('./config/config');

var preWeibos = {
    id: [],
    content: {}
}; 													//前一次微博的查询结果
var currentWeibos = {
    id: [],
    content: {}
}; 													//当前这一次微博的查询结果
var preLikes = {
    id: [],
    content: {}
}; 													//前一次赞的查询结果
var currentLikes = {
    id: [],
    content: {}
};													//当前这一次赞的查询结果

setInterval(function() {
	var url = util.getOrigin(config.url);
	requestFunc(url, parseWeibo); 					//解析somebody的微博主页
	requestFunc(url + '/like', parseLike); 			//解析somebody的赞
}, config.interval);

/**
 * 请求方法
 */
function requestFunc(url, callback) {
    request({
        url: url,
        headers: config.headers,
        timeout: 15000,
        encoding: null
    }, function(error, response, data) {
        if (!error && response.statusCode == 200) {
            var buffer = new Buffer(data);
            var encoding = response.headers['content-encoding'];
            if (encoding == 'gzip') {
                zlib.gunzip(buffer, function(err, decoded) {
                    callback(err && ('unzip error' + err), decoded && decoded.toString());
                });
            } else if (encoding == 'deflate') {
                zlib.inflate(buffer, function(err, decoded) {
                    callback(err && ('deflate error' + err), decoded && decoded.toString());
                });
            } else {
                callback(null, buffer.toString());
            }
        }
    });
}
/**
 * 获取微博名
 */
function getWeiboName(data) {
    //onick']='
    //的长度为9
    var onick = data.indexOf('onick');
    if (onick < 0) {
        return '';
    }
    var quote = data.indexOf("'", onick + 9);
    return data.substring(onick + 9, quote);
}
/**
 * 解析微博
 */
function parseWeibo(err, data) {
    if (err || !data) {
        return;
    }
    var weiboName = getWeiboName(data);
    if (!weiboName) {
        return;
    }
    preWeibos.id = currentWeibos.id.slice(0); //拷贝数组
    preWeibos.content = util.clone(currentWeibos.content);
    var homeFeed = data.lastIndexOf('pl.content.homeFeed.index');
    var endFeed = data.indexOf('</script>', homeFeed);
    if (homeFeed < 0 || endFeed < 0) {
        return;
    }
    //<script>FM.view({"ns":"
    //的长度为23
    var scriptHtml = data.substring(homeFeed - 23, endFeed);
    var mainData = scriptHtml.substring(scriptHtml.indexOf('{'), scriptHtml.lastIndexOf('}') + 1);
    try {
        var object = JSON.parse(mainData);
        var $ = cheerio.load(object.html, {
            decodeEntities: false //设置为false会将实体转换为可读的文本
        });
        var weibos = $('.WB_cardwrap.WB_feed_type.S_bg2');
        currentWeibos.id = [];
        for (var i = 0, len = weibos.length; i < len; i++) {
            var weiboId = $(weibos[i]).attr('mid');
            currentWeibos.id.push(weiboId);
            currentWeibos.content[weiboId] = $(weibos[i]).find('.WB_text.W_f14').html() || '';
        }
        if (diffWeibos()) {
            var subject = '"' + weiboName + '"的最新动态';
            var html = getContents(getNewWeibos(), weiboName);
            mail(subject, html);
        }
    } catch (e) {
        log.info(e);
    }
}
/**
 * 解析上一次查询和这一次查询的不同，并找出不同
 */
function diffWeibos() {
    //微博为空，则不发送
    if (!currentWeibos.id.length) {
        return false;
    }
    //第一次抓取，则发送
    if (!preWeibos.id.length) {
        return true;
    }
    if (preWeibos.id.toString() == currentWeibos.id.toString()) {
        return false;
    }
    return true;
}

function getNewWeibos() {
    var newWeibos = [],
        weiboId = '';
    for (var i = 0, len = currentWeibos.id.length; i < len; i++) {
        weiboId = currentWeibos.id[i];
        if (preWeibos.id.indexOf(weiboId) === -1) {
            newWeibos.push(currentWeibos.content[weiboId]);
        }
    }
    return newWeibos;
}
/**
 * 解析赞
 */
function parseLike(err, data) {
    if (err || !data) {
        return;
    }
    var weiboName = getWeiboName(data);
    if (!weiboName) {
        return;
    }
    preLikes.id = currentLikes.id.slice(0); //拷贝数组
    preLikes.content = util.clone(currentLikes.content);
    var homeFeed = data.lastIndexOf('pl.content.homeFeed.index');
    var endFeed = data.indexOf('</script>', homeFeed);
    if (homeFeed < 0 || endFeed < 0) {
        return;
    }
    var scriptHtml = data.substring(homeFeed - 23, endFeed);
    var mainData = scriptHtml.substring(scriptHtml.indexOf('{'), scriptHtml.lastIndexOf('}') + 1);
    try {
        var object = JSON.parse(mainData);
        var $ = cheerio.load(object.html, {
            decodeEntities: false //设置为false会将实体转换为可读的文本
        });
        var likes = $('.WB_cardwrap.WB_feed_type.S_bg2');
        currentLikes.id = [];
        for (var i = 0, len = likes.length; i < len; i++) {
            var likeId = $(likes[i]).attr('mid');
            currentLikes.id.push(likeId);
            currentLikes.content[likeId] = $(likes[i]).find('.WB_text.W_f14').html() || '';
        }
        if (diffLikes()) {
            var subject = '"' + weiboName + '"的最新动态';
            var html = getContents(getNewLikes(), weiboName);
            mail(subject, html);
        }
    } catch (e) {
        log.info(e);
    }
}
/**
 * 解析上一次查询和这一次查询的不同，并找出不同
 */
function diffLikes() {
    //微博为空，则不发送
    if (!currentLikes.id.length) {
        return false;
    }
    //第一次抓取，不发送
    if (!preLikes.id.length) {
        return true;
    }
    if (preLikes.id.toString() === currentLikes.id.toString()) {
        return false;
    }
    return true;
}

function getNewLikes() {
    var newLikes = [],
        likeId = '';
    for (var i = 0, len = currentLikes.id.length; i < len; i++) {
        likeId = currentLikes.id[i];
        if (preLikes.id.indexOf(likeId) === -1) {
            newLikes.push(currentLikes.content[likeId]);
        }
    }
    return newLikes;
}

function getContents(list, weiboName) {
    var html = '<p><span>微博地址:</span><a href="' + config.url + '">' + weiboName + '</a></p>';
    if (util.isArray(list)) {
        for (var i = 0, len = list.length; i < len; i++) {
            html += '<p>' + (i + 1) + ':' + list[i] + '</p>';
        }
    } else {
        html = '<p>' + list + '</p>';
    }
    return html;
}