var config = {
    'options': {                    //发送地址
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: 'wjpxjtu@gmail.com',
            pass: ''
        }
    },
    'address': '466368084@qq.com', //目标地址
    'url': 'http://weibo.com/271987725',
    // 发送的请求头部
    'headers': {
        'Cache-Control': 'max-age=31536000',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, sdch',
        'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116 Safari/537.36',
        'Upgrade-Insecure-Requests': '1',
        'Connection': 'keep-alive',
        'Host': 'weibo.com',
        //cookie,可能会变化
        'Cookie': ''
    },
    'interval': 1000 * 60 * 1 //查询的间隔时间
};
module.exports = config;