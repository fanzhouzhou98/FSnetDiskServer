const { sendEmail } = require('../utils/email')
const { map } = require('../utils/map')
const result = require('../utils/result');
const { setState, isLinited } = require('../utils/limitCount')
const { get, set, qiut } = require('../utils/redis')

const getRandom = () => {
    return parseInt(Math.random() * 9000 + 1000)
}
class EmailController {

    static async sendVerifyCode(ctx, next) {
        let { email } = ctx.request.body
        let pwd = getRandom()
        let user = email.split('@')[0];
        let info = await get(user)
        if (info && info.count >= 3) {
            ctx.body = result(null, '操作频繁，请5分钟后再获取验证码', false)
            return
        }
        if (info) {
            set(user, { pwd, count: info.count + 1 }, 1000 * 60 * 5)
        } else {
            set(user, { pwd, count: 1 }, 1000 * 60 * 5)
        }
        let data = await sendEmail(email, pwd).catch((err) => {
            ctx.body = result(null, err, false)
        })
        if (data.status == 200) {
            ctx.body = result(info, data.message)
        } else if (data.status == 0) {
            ctx.body = result(null, data.message, false)
        }
    }
}
module.exports = EmailController