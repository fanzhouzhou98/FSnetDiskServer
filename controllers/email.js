const { sendEmail } = require('../utils/email')
const { map } = require('../utils/map')
const result = require('../utils/result');
const { setState, isLinited } = require('../utils/limitCount')
const { get, set } = require('../utils/redis')
const getRandom = () => {
    return parseInt(Math.random() * 9000 + 1000)
}
class EmailController {
    static async sendVerifyCode(ctx, next) {
        let { email } = ctx.request.body
        // if (isLinited(email)) {
        //     ctx.body = result(null, '今日发送次数超过上限！', false)
        //     return
        // }
        let pwd = getRandom()
        let timer = null
        let user = email.split('@')[0];
        // let info = map.get(user)
        let info = get(user)
        // info && (timer = info.timer) && clearTimeout(timer)
        set(user, pwd, 5 * 1000 * 60)
        // timer = setTimeout(() => { map.delete(user) }, 5 * 1000 * 60)
        // map.set(user, { pwd, timer })
        let data = await sendEmail(email, pwd).catch((err) => {
            ctx.body = result(null, err, false)
        })
        if (data.status == 200) {
            ctx.body = result(null, data.message)
        } else if (data.status == 0) {
            ctx.body = result(null, data.message, false)
        }
        pwd = null
    }
}
module.exports = EmailController