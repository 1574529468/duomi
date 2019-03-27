//管理员的数据模型
//引入数据库配置模块
var mongoose=require('../configs/db_config.js');
//定义集合的骨架（用来约束集合的）
const adminSchema=new mongoose.Schema({
    name:String,//账号
    password:String,//密码
    tel:Number,//电话
    info:String,//栏目简介
    imgurl:String,//头像
    ctime:{
        type:Date,
        default:new Date()
    }
});
//创建数据类型
var adminModel=mongoose.model('amdin',adminSchema);
//暴露栏目数据模型
module.exports=adminModel;