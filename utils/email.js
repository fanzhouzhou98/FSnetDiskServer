const nodemailer = require('nodemailer');
var { EMAIL_OPTION, EMAIL_VERIFY_CODE_OPTION } = require('../config/email')

function sendEmail(receive, verifyCode) {
    let trans = nodemailer.createTransport(EMAIL_OPTION);
    Object.assign(EMAIL_VERIFY_CODE_OPTION, {
        text: EMAIL_VERIFY_CODE_OPTION.text.replace(/\{(\w*)\}/, verifyCode),
        to: receive
    })
    return new Promise((resolve, reject) => {
        trans.sendMail(EMAIL_VERIFY_CODE_OPTION, err => {
            err && reject({ "status": 0, "message": err })
            EMAIL_VERIFY_CODE_OPTION.text = '你的验证码是：{verifyCode}，有效期5分钟。为了你的账户按全请勿向他人泄露你的验证码'
            resolve({ "status": 200, "message": "发送成功" })
        })
    })
}

module.exports = {
    sendEmail
}