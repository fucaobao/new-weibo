var config = require('../config/config');
var request = require('request');
var cheerio = require('cheerio');
var util = require('./util');

function parseResponse(err, html) {
    if (err || !html) {
        return;
    }
    var data = JSON.parse(html);
    var $ = cheerio.load(data.data, {
        decodeEntities: false //设置为false会将实体转换为可读的文本
    });
    console.log($('div').html());
}
var fetchWeibo = function(page, pagebar) {
    var obj = {};
    var url = 'http://weibo.com/aj/mblog/fsearch?ajwvr=6&__rnd=' + new Date().getTime();
    var form = {
        'ajwvr': 6,
        'wvr': 5,
        'pre_page': page || 1,
        'page': page || 1,
        'end_id': '',
        'min_id': '',
        'pagebar': pagebar || 0,
        '__rnd': new Date().getTime()
    };
    obj.url = url;
    obj.method = 'get';
    obj.form = form;
    util.request(obj, parseResponse);
};
var sendWeibo = function(contents) {
    var obj = {};
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
    obj.url = url;
    obj.method = 'post';
    obj.form = form;
    util.request(obj, parseResponse);
};
var deleteWeibo = function(mid) {
    var obj = {};
    var url = 'http://weibo.com/aj/mblog/del?ajwvr=6';
    var form = {
        'mid': mid
    };
    obj.url = url;
    obj.method = 'post';
    obj.form = form;
    util.request(obj, parseResponse);
};
exports.fetch = fetchWeibo;
exports.send = sendWeibo;
exports.del = deleteWeibo;