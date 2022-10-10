module.exports = {
    // 邮箱配置
    EMAIL_OPTION: {
        host: 'smtp.qq.com',
        port: '465',
        secure: true,
        auth: {
            user: '482909836@qq.com',
            pass: 'kqiftedcniwecajc'
        }
    },
    //邮箱模板
    EMAIL_VERIFY_CODE_OPTION: {
        from: '"FSnetDisk" <482909836@qq.com>',
        subject: '重置密码验证码',
        text: '你的验证码是：{verifyCode}，有效期5分钟。为了你的账户按全请勿向他人泄露你的验证码',
        html: ''
    },
    //账号异常登录模板
    EMAIL_LOGIN_WARN_OPTION: {
        from: 'fzz',
        subject: '登录警告',
        text: '用户：{username}，你的账号在{ipAddress}登录，如果非本人操作，请及时修改密码。',
        html: ''
    }
}