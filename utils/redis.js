/**
 * redis.js
 * redis的方法get和set
*/
const redis = require('koa-redis')
const { REDIS_CONF } = require('../config/cache')

// 创建客户端
const redisClient = redis({ url: 'redis://127.0.0.1:6379', })
redisClient.on('error', err => {
    console.error('redis error', err)
})
//添加数据
async function set(key, value, time) {
    await redisClient.set(key, value, time)
}
//获取数据
async function get(key) {
    return new Promise((resolve, reject) => {
        const data = redisClient.get(key)
        if (data) {
            resolve(data)
        } else {
            reject(false)
        }
    })
}
//删除数据
async function delet(key) {
    await redisClient.destroy(key)
}


module.exports = {
    get,
    set,
    delet
}