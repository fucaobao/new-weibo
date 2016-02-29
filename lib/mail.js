/**
 *
 * 需要将
 * https://www.google.com/settings/security/lesssecureapps
 * 设置为"启用"
 *
 */
var nodemailer = require('nodemailer');
var config = require('../config/config');

/*
 *发件人信息
 */
var options = config.options;
var transporter = nodemailer.createTransport(options);
var mailOptions = {
    from: options.auth.user, // 发件人
    to: config.address,      // 收件人(多个用逗号分开)
    subject: '',             // 主题
    text: '',                // 纯文本内容
    html: ''                 // html内容
};

function sendMail(subject, html) {
    mailOptions.subject = subject;
    mailOptions.html = html;
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log(info);
        }
    });
}
module.exports = sendMail;