var diskinfo = require('diskinfo');
//当前盘符
var current_disk = __dirname.substr(0, 2).toLowerCase();

//获得所有磁盘空间
const getDiskInfo = () => {
    return new Promise((resolve, reject) => {
        diskinfo.getDrives(function (err, aDrives) {
            if (err) {
                reject(err)
            }
            if (aDrives) {
                //遍历所有磁盘信息
                for (var i = 0; i < aDrives.length; i++) {

                    //只获取当前磁盘信息
                    if (aDrives[i].mounted.toLowerCase() == current_disk) {

                        //盘符号
                        var mounted = aDrives[i].mounted;
                        //总量
                        var total = + (aDrives[i].blocks / 1024 / 1024 / 1024).toFixed(2);
                        //已使用
                        var used = (aDrives[i].used / 1024 / 1024 / 1024).toFixed(2);
                        //可用
                        var available = (aDrives[i].available / 1024 / 1024 / 1024).toFixed(2);
                        //使用率
                        var capacity = aDrives[i].capacity;

                        console.log(mounted + "\r\n" + total + "\r\n" + used + "\r\n" + available + "\r\n" + capacity);
                        resolve({ mounted, total, used, available, capacity })
                    }
                }
            }
        });
    })
}
module.exports = getDiskInfo

