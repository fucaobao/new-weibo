# somebody-weibo

1. 采用爬虫模拟登录微博

2. 抓取somebody的最新"微博"和"赞"

3. 发送最"微博"和"赞"博到指定的邮箱

## Download

  下载 somebody-weibo 模块：

`
$ git clone https://github.com/fucaobao/somebody-weibo.git
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

  1. 目前没有较好的算法获取最新更新的"微博"和"赞"，getNewWeibos和getNewZans方法需要重新修改

  2. 抓取的转发微博中，只包括自己所写的那一部分，下面的转发微博暂时没有，有待改善解析方法。

  3. 在某些特殊情况下，抓取页面会失败，有待优化。

