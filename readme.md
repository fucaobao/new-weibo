# new-weibo-crawler

1. 采用爬虫模拟登录微博

2. 抓取某人的最新"微博"和"赞"

3. 发送最"微博"和"赞"博到指定的邮箱

## Download

  下载 new-weibo-crawler 模块：

`
$ git clone https://github.com/fucaobao/new-weibo-crawler.git
`

## Options

  在lib/config.js中设置。

  1. options: 邮件的发送地址

	* host: 邮箱服务器

	* user: 邮箱地址

	* pass: 邮箱密码

  2. address: 邮件的接收地址

  3. url: somebody的微博主页

  4. Cookie: 微博的Cookie

## Bugs

  1. getNewWeibos和getNewLikes算法需要优化。

  2. 运行时间较长后，Cookie可能会失效，需要重新生成。

