const fileModel = require('../services/files');
const userModel = require('../schema/user');
const result = require('../utils/result');
const UserModel = require('../services/user');
const crypto = require('crypto')
const fs = require('fs')
const path = require('path');
const sequelize = require('../config/db');
const getDiskInfo = require('../utils/diskinfo')
const Op = sequelize.Op;

let readFileMd5 = (url) => {
  return new Promise((reslove) => {
    let md5sum = crypto.createHash('md5');
    let stream = fs.createReadStream(url);
    stream.on('data', function (chunk) {
      md5sum.update(chunk);
    });
    stream.on('end', function () {
      let fileMd5 = md5sum.digest('hex');
      reslove(fileMd5);
    })
  })
}

class FilesController {
  static async add(ctx) {
    const fileData = ctx.req.file
    const hash = await readFileMd5(fileData.path)
    if (fileData) {
      fileData.hash = hash
      fileData.name = fileData.originalname
      fileData.userId = ctx.state.userInfo.id
      const newData = await fileModel.add(fileData)
      ctx.body = result(newData)
    } else {
      ctx.body = result(null, '参数错误', false)
    }
  }
  static async delete(ctx, next) {
    const query = ctx.request.body;
    let one = await fileModel.findOne(query);
    if (one) {
      const newOne = await fileModel.update({
        id: one.id,
        isDeleted: true
      });
      ctx.body = result({
        newOne,
      }, '删除成功')
    } else {
      ctx.body = result(null, '删除失败，操作对象不存在', false)
    }
  }
  static async deleteFile(ctx, next) {
    const query = ctx.request.body;
    let one = await fileModel.findOne(query);
    if (one) {
      let file = one.path
      let tem = file.split('\\').join('/')
      file = path.join(__dirname, `../${tem}`)
      fs.unlinkSync(file)
      const newOne = await fileModel.delete({
        id: one.id,
      });
      ctx.body = result(true, '删除成功')
    } else {
      ctx.body = result(null, '删除失败，操作对象不存在', false)
    }
  }
  static async restore(ctx, next) {
    const query = ctx.request.body;
    let one = await fileModel.findOne(query);
    if (one) {
      const newOne = await fileModel.update({
        id: one.id,
        isDeleted: false
      });
      ctx.body = result({
        newOne,
      }, '文件已恢复')
    } else {
      ctx.body = result(null, '恢复失败，操作对象不存在', false)
    }
  }

  static async update(ctx) {
    const role = ctx.state.userInfo.role
    const id = ctx.state.userInfo.id
    const newData = ctx.request.body;
    console.log(newData)
    if (role === 'admin' || newData.userId === id) {
      await fileModel.update(newData);
      ctx.body = result(null, '更新成功')
    } else {
      ctx.body = result(null, '无权限操作', false)
    }

  }

  static async createShare(ctx) {
    const newData = ctx.request.body;
    newData.userId = ctx.state.userInfo.id
    if (newData.shareType === 'private') {
      newData.shareKey = Math.random().toString(36).substr(2).slice(1, 5)
    }
    newData.shareUrl = Math.random().toString(36).substr(2).slice(1, 10)
    await fileModel.update(newData);
    ctx.body = result(newData, '更新成功')
  }

  static async list(ctx, next) {
    const userId = ctx.state.userInfo.id
    const query = ctx.request.body
    let list = await fileModel.findList({
      ...query,
      userId,

    });
    ctx.body = result({ list }, '查询成功')
  }

  static async adminList(ctx, next) {
    const query = ctx.request.body
    const role = ctx.state.userInfo.role
    let { uploader } = query
    let user = await UserModel.findUser({ name: uploader })
    console.log(user)
    delete query.uploader
    if (role === 'admin') {
      let list = null
      if (user && user.length !== 0) {
        list = await fileModel.findList({
          ...query,
          userId: user.id,
        });
      } else {
        list = await fileModel.findList({
          ...query,
        });
      }
      ctx.body = result({ list }, '查询成功')
    } else {
      ctx.body = result(null, '无权限操作', false)
    }

  }

  static async shareDetail(ctx, next) {
    const query = ctx.request.body
    if (!query.shareKey) {
      const one = await fileModel.findOneWithUser({
        shareUrl: query.shareUrl,
        isDeleted: false,
      }, {
        exclude: ['shareKey'],
      });
      console.log(one)
      // one.user.name = one.user.name.replace(/(.{3})(.+)/g, ($1, $2, $3) => {
      //   return $2 + "*".repeat($3.length-3);
      // })
      // if (one.shareType !== 'open') {
      //   delete one.path
      // }
      ctx.body = result(one, '查询成功')
    } else {
      const one = await fileModel.findOneWithUser({
        ...query,
        isDeleted: false
      });
      if (one) {
        // one.user.name = one.user.name.replace(/(.{3})(.+)/g, ($1, $2, $3) => {
        //   return $2 + "*".repeat($3.length-3);
        // })
        ctx.body = result(one, '查询成功')
      } else {
        ctx.body = result(null, '密码不正确', false)
      }
    }

  }

  static async shareList(ctx, next) {
    const userId = ctx.state.userInfo.id
    const query = ctx.request.body
    let list = await fileModel.findList({
      ...query,
      userId,
      isDeleted: false,
      shareType: {
        [Op.not]: null
      }
    });
    ctx.body = result({ list }, '查询成功')
  }

  static async getDiskInfo(ctx, next) {
    let diskInfo = await getDiskInfo()
    if (diskInfo) {
      ctx.body = result(diskInfo, '查询磁盘信息成功')
    } else {
      ctx.body = result(null, '查询磁盘信息失败', false)
    }
  }
}
module.exports = FilesController
