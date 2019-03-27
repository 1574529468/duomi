//数据库mongoose的配置模块
//引入mongoose模块
const mongoose = require('mongoose');
//数据库地址
const dbUrl = 'mongodb://localhost:27017/midu'
//连接数据库
mongoose.connect(dbUrl,function(err){
    if(err){
        console.log('链接数据库失败');
    }else{
        console.log('连接数据库成功')
    }
});
//暴露mongoose的配置模块
module.exports=mongoose;