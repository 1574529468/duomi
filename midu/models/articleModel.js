// 引入 数据库配置 模块
var mongoose = require('../configs/db_config.js');

// 2. 定义 文章 集合的骨架 （用来约束 集合的）
const articleSchema = new mongoose.Schema({
	itemId:{  				// 栏目Id
		type: 'ObjectId',
		ref:'item'			// 关联 item 集合
	},
	title: String,  		// 标题
	keywords: String,   	// 关键字
	imgurl:String,			// 封面
	description: String,   	// 文章描述
	author: String,   		// 作者
	content: String,   		// 文章
	tuijian:Number,     //推荐
	ctime: {
		type:Date,
		default: new Date()
	}
});

// 3. 创建数据模型
var articleModel = mongoose.model('aritcle',articleSchema);

// 暴露栏目数据模型
module.exports = articleModel;
