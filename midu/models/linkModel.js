//栏目的数据模型
//引入数据配置模块
var mongoose=require('../configs/db_config.js');
//定义集合的骨架(用来约束集合)
const linkSchema=new mongoose.Schema({
    name: String,   // 友情名称
	yurl: String , // 友情地址
	ctime: {
		type:Date,
		default: new Date()
	}
});
//创建数据模型
var linkModel=mongoose.model('link',linkSchema);
//暴露栏目数据模型
module.exports=linkModel;