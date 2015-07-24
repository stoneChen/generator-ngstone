//本文模块将被Gruntfile.js依赖(require),用于额外的参数配置
module.exports = {
    //雪碧图附加资源配置列表，主要用于排除
    //demo:'!app/images/mine/bg.png'
    spriteSrcEX:[

    ],
    //开发环境启动脚本，需动态添加的脚本
    serveScripts:[
        //'http://192.168.183.253:8080/target/target-script-min.js#anonymous',  //weinre调试脚本，请自行修改IP
    ],
    serverBoundWithIP:true //本地服务是否绑定IP地址，true则以IP启动(配合chrome插件，手机扫码访问更便捷，如果电脑IP变化了，则需要重启)，false则以localhost启动(如果电脑IP变化了，不需重启)
};