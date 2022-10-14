const diskinfo = require('diskinfo');
const os = require('os');

//当前盘符
var current_disk = __dirname.substr(0, 2).toLowerCase();


//获得所有磁盘空间
const getDiskInfo = () => {
    if (os.platform() == 'win32') {
        return new Promise((resolve, reject) => {
            diskinfo.getDrives(function (err, aDrives) {
                if (err) {
                    reject(err)
                }
                if (aDrives) {
                    //遍历所有磁盘信息
                    for (let i = 0; i < aDrives.length; i++) {

                        //只获取当前磁盘信息
                        if (aDrives[i].mounted.toLowerCase() == current_disk) {

                            //盘符号
                            let mounted = aDrives[i].mounted;
                            //总量
                            let total = + (aDrives[i].blocks / 1024 / 1024 / 1024).toFixed(2);
                            //已使用
                            let used = (aDrives[i].used / 1024 / 1024 / 1024).toFixed(2);
                            //可用
                            let available = (aDrives[i].available / 1024 / 1024 / 1024).toFixed(2);
                            //使用率
                            let capacity = aDrives[i].capacity;

                            console.log(mounted + "\r\n" + total + "\r\n" + used + "\r\n" + available + "\r\n" + capacity);
                            resolve({ mounted, total, used, available, capacity })
                        }
                    }
                }
            });
        })
    }
    if (os.platform() == 'linux') {
        let mounted = 'linux服务器暂不支持', total = 200, used = 40, available = 160, capacity = '20%'
        return new Promise((resolve, reject) => {
            resolve({ mounted, total, used, available, capacity })
        })
    }

}
module.exports = getDiskInfo

