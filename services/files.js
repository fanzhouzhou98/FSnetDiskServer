const sequelize= require('../config/db');
const Files = sequelize.import('../schema/files');
const user = sequelize.import('../schema/user');
const Op = sequelize.Op;
// 通过 sync 方法同步数据结构
// 即,创建表
Files.sync({force: false})
Files.belongsTo(user)


class FilesModel{
  static async findOne(query, attributes, include){
    console.log(include);
    return await Files.findOne({
      where: query,
      attributes,
      include
    })
  }
  
  static async findOneWithUser(query, attributes, include){
    return await Files.findOne({
      where: query,
      attributes,
      include: [{
        model: user,
        where: { id: sequelize.col('files.userId') },
        attributes: ['name'],
        raw: true
      }]
    })
  }
  
  static async add(data){
    return await Files.create(data)
  }
  
  static async update(data){
    return await Files.update(data,{
      where:{
        id: data.id
      }
    })
  }
  
  static async delete(data){
    return await Files.destroy({
      where:{
        id:data.id
      }
    })
  }

  static async findList(query){
    let { name='', pageNo = 1, start,isDeleted,end, pageSize = 1000, ...rest } = query
    let offset = (pageNo - 1) * pageSize;
    return !isDeleted ? await Files.findAndCountAll({
      attributes: {
        // exclude: [],
      },
      where: {
        name: {
          [Op.like]:'%' +name + '%'
        },
          createdAt:{
            [Op.gte]:start,
            [Op.lte]:end
          },
        isDeleted,
        ...rest
      },
      offset,
      limit: pageSize,
      include: [{
        model: user,
        where: { id: sequelize.col('files.userId') },
        attributes: ['name'],
        raw: true
      }]
    }) : await Files.findAndCountAll({
      attributes: {
        // exclude: [],
      },
      where: {
        name: {
          [Op.like]:'%' +name + '%'
        },
        updatedAt:{
            [Op.gte]:start,
            [Op.lte]:end
          },
        isDeleted,
        ...rest
      },
      offset,
      limit: pageSize,
      include: [{
        model: user,
        where: { id: sequelize.col('files.userId') },
        attributes: ['name'],
        raw: true
      }]
    })
  }
  
}
module.exports =  FilesModel
