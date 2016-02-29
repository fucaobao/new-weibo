var config = require('../config/config');
var request = require('request');
var cheerio = require('cheerio');
var zlib = require('zlib');

function requestFunc(url, form, callback) {
    request({
        url: url,
        method: 'post',
        headers: config.headers,
        form: form,
        timeout: 15000,
        encoding: null
    }, function(error, response, data) {
        if (!error && response.statusCode == 200) {
            console.log(data);
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

function parseResponse(err, data) {
    if (err || !data) {
        return;
    }
    var $ = cheerio.load(data, {
        decodeEntities: false //设置为false会将实体转换为可读的文本
    });
    console.log($('html').html());
}
var sendWeibo = function(contents) {
    var url = 'http://weibo.com/aj/mblog/add?ajwvr=6&__rnd=' + new Date().getTime();
    var form = {
        'location': 'v6_content_home',
        'appkey': '',
        'style_type': 1,
        'pic_id': '',
        'text': contents,
        'pdetail': '',
        'rank': 0,
        'rankid': '',
        'module': 'stissue',
        'pub_source': 'main_',
        'pub_type': 'dialog',
        '_t': 0
    };
    requestFunc(url, form, parseResponse);
};
var deleteWeibo = function(mid) {
    var url = 'http://weibo.com/aj/mblog/del?ajwvr=6';
    var form = {
        'mid': mid
    };
    requestFunc(url, form, parseResponse);
};
exports.send = sendWeibo;
exports.del = deleteWeibo;