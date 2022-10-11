
const router = require('koa-router')()
const UserController = require('../controllers/user')
const EmailController = require('../controllers/email')
router.prefix('/user')

/**
 * 用户接口
 */

// 用户注册
router.post('/register', UserController.register);
// 用户登录
router.post('/login', UserController.login);
// // 删除用户
router.delete('/delete/:id', UserController.delete);
// // 获取用户信息
router.get('/info', UserController.getUserInfo);
router.get('/getUserInfoById', UserController.getUserInfoById)
// 获取用户列表
router.post('/list', UserController.adminList);
router.post('/delete', UserController.delete);
router.post('/update', UserController.update);
router.post('/resetPassword', UserController.updateUserPassword)
router.post('/updateUserName', UserController.updateUserName)
router.post('/sendVerifyCode', EmailController.sendVerifyCode)
router.post('/getUserEmailByName', UserController.getUserEmailByName)
router.post('/resetPasswordByCode', UserController.resetPasswordByCode)
module.exports = router
