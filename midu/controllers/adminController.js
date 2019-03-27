//管理员功能的控制
var adminController={};
//引入数据模型 
var itemModel=require('../models/itemModel.js');
var articleModel = require('../models/articleModel.js');
var adminModel=require('../models/adminModel.js');
var linkModel=require('../models/linkModel.js');
//引入md5（加密），模块
var md5=require("md5");


//首页
adminController.index=function(req,res){
	if(!req.session.user)res.redirect('/admin/login');
    //响应模板
    res.render('admin/index');
}
//添加栏目页面
adminController.itemAdd=function(req,res){
	if(!req.session.user)res.redirect('/admin/login');
    res.render('admin/itemAdd');
}
// 插入栏目数据
adminController.itmeInsert = function(req,res){
	// 插入数据
	itemModel.create(req.body,function(err){
		if(err){
			res.render('admin/error',{errText:'插入数据失败'});
		}else{
            res.redirect('/admin/itemList')
		}
	})
}
//栏目列表
adminController.itemList=function(req,res){
	//查询数据
	itemModel.find({}).sort({order:1}).exec(function(err,data){
		if(err){
			res.render('admin/error',{errText:'查收数据失败'});
		}else{
			if(!req.session.user)res.redirect('/admin/login');
			//响应面板
			res.render('admin/itemList',{datas:data});
		}
	})
	
}
//栏目编辑
adminController.itemEdit=function(req,res){
	//查询数据
	itemModel.findById(req.params._id,function(err,data){
		if(err){
			console.log('进入失败');
		}else{
			res.render("admin/itemEdit",{datas:data});
		}

	})
}
//栏目修改
adminController.itemUpdate=function(req,res){

	itemModel.update({_id:req.body._id},req.body,function(err){
		if(err){
			res.render('admin/error',{errText:'修改数据失败'});
		}else{
			res.redirect("/admin/itemList");

		}
	})
}
//栏目删除
adminController.itemRemove=function(req,res){
	articleModel.find({itemId:req.params._id},function(err,data){
		if(err){
			res.send('查询失败');
		}else{
			if(data!=null&&data.length<=0){
				itemModel.remove({_id:req.params._id},function(err){
					if(err){
						res.send('删除数据失败');
						// res.render('admin/error',{errText:'删除数据失败'});
					}else{
						res.redirect("/admin/itemList");
					}
				})
			}else{
				// res.send('文章中有数据，无法删除此栏目');
				res.render('admin/error',{errText:'文章中有数据，无法删除此栏目'});
			}
		}
	})
	
}

//发布文章的页面
adminController.articleAdd=function(req,res){
	//查询数据
	itemModel.find({},function(err,items){
		if(err){
			res.render('admin/error',{errText:'查收数据失败'});
		}else{
			if(!req.session.user)res.redirect('/admin/login');
			//响应模板
			res.render('admin/articleAdd',{item:items});
		}
	})
}
//插入文章
adminController.articleInsert=function(req,res){
	//引入图片上传
	var uploadImage = require('../configs/uploadImage_config.js');
	//准备参数
	var imagePath='upload';
	//允许接收图片类型
	var imageType= ['image/jpeg','image/png','image/gif'];
	var fileSize=1024*1024*5;
	var upload = uploadImage(imagePath,imageType,fileSize).single('imgurl');
	upload(req,res,function(err){
		if(err){
			res.render('admin/error',{errText:'图片上传失败'});
		}else{
			// 把接收到的图片路径存到 关联的数据
			req.body.imgurl = req.file.filename;
			// 添加数据
			articleModel.create(req.body,function(err){
				if(err){
					res.render('admin/error',{errText:'发布文章'});
				}else{
					res.redirect('/admin/articleList');
				}
			})
		}
	})
}

//文章列表
adminController.articleList=function(req,res){
	//每页显示数据的条数
	var pageSize=5;
	//页面
	var page=req.query.page?req.query.page:1;
	// res.send(page);
	//数据的总条数
	articleModel.find({}).count(function(err,total){
		if(err){
			res.render('admin/error',{errText:'查收数据失败'});
		}else{
			//最大的页码
			var pageMax=Math.ceil(total/pageSize);
			//处理页面边界
			if(page<1)page=1;
			if(page>pageMax)page=pageMax;
			//查询的偏移量
			var offsetPage=pageSize*(page-1);
			//查询文章数据
			articleModel.find({}).limit(pageSize).skip(offsetPage).populate('itemId',{name:1}).exec(function(err,data){
				if(err){
					res.render('admin/error',{errText:'查收数据失败'});
				}else{
					if(!req.session.user)res.redirect('/admin/login');
					//响应模板
					res.render('admin/articleList',{datas:data,pageMax:pageMax,page:page});
				}
			})
		}
	})
}
//推荐文章
adminController.tuijianList=function(req,res){
	
	articleModel.find({}).count(function(err,total){
		if(err){
			res.render('admin/error',{errText:'查收数据失败'});
		}else{
			
			//查询文章数据
			articleModel.find({tuijian:0}).populate('itemId',{name:1}).exec(function(err,data){
				if(err){
					res.render('admin/error',{errText:'查收数据失败'});
				}else{
					if(!req.session.user)res.redirect('/admin/login');
					//响应模板
					res.render('admin/tuijianList',{datas:data});
				}
			})
		}
	})
}
//文章编辑
adminController.articleEdit=function(req,res){
	//查询数据
	articleModel.findById(req.params._id,function(err,data){
		if(err){
			console.log('进入失败');
		}else{
			//查询数据
		itemModel.find({},function(err,items){
			if(err){
				res.render('admin/error',{errText:'查收数据失败'});
			}else{
				//响应模板
				res.render("admin/articleEdit",{datas:data,item:items});
			}
			})
		}
	})
}
//文章修改
adminController.articleUpdate=function(req,res){
	articleModel.update({_id:req.body._id},{$set:req.body},function(err){
		if(err){
			res.render('admin/error',{errText:'修改数据失败'});
		}else{
			res.redirect("/admin/articleList");
		}
	})
}


//图片传值
adminController.articleImage=function(req,res){
	//查询数据
	articleModel.findOne({_id:req.params._id},function(err,data){
		if(err){
			res.render('admin/error',{errText:'查收数据失败'});
		}else{
			//响应面板
			// res.send(data);
			 res.render('admin/articleImageUpdate',{datas:data});
		}
	})
}
//更新文章封面
adminController.articleImageUpdate=function(req,res){
	//引入图片上传
	var uploadImage=require('../configs/uploadImage_config.js');
	//图片存放的位置
	var imagePath = 'upload';
	//允许接收图片的类型
	var imageType=['image/jpeg','image/png'];
	//图片大小
	var filSize=1024*1024*5;
	//上传图片
	var upload=uploadImage(imagePath,imageType,filSize).single('imgurl');
	upload(req,res,function(err){
		if(err){
			res.render('admin/error',{errText:'图片上传失败'});
		}else{
			//更新文章封面
			articleModel.update({_id:req.body._id},{$set:{imgurl:req.file.filename}},function(err){
				if(err){
					res.render('admin/error',{errText:'更改数据封面失败'});
				}else{
					res.redirect('/admin/articleList');
				}
			})
		}
	})	
}




//删除文章
adminController.articleRemove=function(req,res){
	articleModel.remove({_id:req.params._id},function(err){
		if(err){
			res.render('admin/error',{errText:'删除失败'});
		}else{
			res.redirect("/admin/articleList");
		}
	})
}
//添加管理员
adminController.adminadd=function(req,res){
	if(!req.session.user)res.redirect('/admin/login');
	res.render('admin/adminadd')
}
//管理员插入数据
adminController.adminInsert=function(req,res){
	//引入图片上传
	var uploadImage=require('../configs/uploadImage_config.js');
	//图片存放的位置
	var imagePath = 'upload';
	//允许接收图片的类型
	var imageType=['image/jpeg','image/png'];
	//图片大小
	var filSize=1024*1024*5;
	//上传图片
	var upload=uploadImage(imagePath,imageType,filSize).single('imgurl');
	upload(req,res,function(err){
		if(err){
			// res.send(err);
			res.render('admin/error',{errText:'图片上传失败'});
		}else{
			//获取用户输入的验证码
			var userCode=req.body.code;
			//获取存在session里的验证码
			var sessionCode=req.session.code;
			//判断验证码
			if(userCode !=sessionCode){
				res.render('admin/error',{errText:'验证码不正确'});
				return;
			}
			//判断两次输入的密码是否一致
			req.body.password=md5(req.body.password);
			req.body.respassword=md5(req.body.respassword);
			if(req.body.password != req.body.respassword){
				// console.log(req.body.respassword)
				// console.log(req.body.password)
				res.render('admin/error',{errText:'两次输入的密码不一样'});
				return;
			}
			//取消用户名两端空格
			req.body.name=req.body.name.trim();
			//把头像关联到用户
			req.body.imgurl=req.file.filename;
			//插入数据
			adminModel.create(req.body,function(err){
				if(err){
					res.render('admin/error',{errText:'插入数据失败'});
				}else{
					res.redirect('/admin/adminList');
				}
			})
		}
	})
}


//验证码
adminController.code = function(req,res){
	// 引入验证码模块
	var captchapng = require('captchapng');
	// 验证码的内容
	var code = parseInt(Math.random()*9000+1000);
	// 把 验证码 内容存 到 session 里
	req.session.code = code;
	// width,height,numeric captcha
    var p = new captchapng(80,30,code); 
    // First color: background (red, green, blue, alpha)
    p.color(0, 0, 0, 0);  
    // Second color: paint (red, green, blue, alpha)
    p.color(80, 80, 80, 255); 
    var img = p.getBase64();
    var imgbase64 = new Buffer(img,'base64');
    res.send(imgbase64);
}
//管理员列表
adminController.adminList=function(req,res){
	//查询数据
	adminModel.find({},function(err,data){
		if(err){
			res.render('admin/error',{errText:'查收数据失败'});;
		}else{
			if(!req.session.user)res.redirect('/admin/login');
			//响应面板
			res.render('admin/adminList',{datas:data});
		}
	})
}
//管理员查询
adminController.adminEdit=function(req,res){
	//查询数据
	adminModel.findById({_id:req.params._id},function(err,data){
		if(err){
			res.send(err);
			console.log('进入失败');
		}else{
			if(!req.session.user)res.redirect('/admin/login');
			res.render("admin/adminEdit",{datas:data});
		}

	})
}
//管理员修改
adminController.adminUpdate=function(req,res){
	req.body.password=md5(req.body.password);
	adminModel.update({_id:req.body._id},{$set:req.body},function(err){
		if(err){
			res.render('admin/error',{errText:'修改失败'});
		}else{
			res.redirect("/admin/adminList");
		}
	})
}
//管理员删除
adminController.adminRemove=function(req,res){
	adminModel.remove({_id:req.params._id},function(err){
		if(err){
			res.render('admin/error',{errText:'删除失败'});
		}else{
			res.redirect("/admin/adminList");
		}
	})
}
//登录页面
adminController.login=function(req,res){
	res.render('admin/login');
}
//管理员登录
adminController.dlogin=function(req,res){
	//获取用户输入的验证码
	var userCode=req.body.code;
	//获取存在session里的验证码
	var sessionCode=req.session.code;
	//判断验证码
	if(userCode !=sessionCode){
		res.send('验证码不正确');
		return;
	}
	//接收账户和密码处理
	var name=req.body.name.trim();
	var password=md5(req.body.password);

	adminModel.findOne({name:name},function(err,data){
		if(err){
			res.send('登录失败');
		}else{
			if(data==null){
				res.send('用户名不存在');
			}else{
				if(password==data.password){
					//用户登陆成功
					//吧用户信息存储到session里
					req.session.user=data;
					res.redirect('/admin');
				}else{
					//密码不正确
					res.send('密码不正确');
				}
			}
		}
	})	
}

//退出登录
adminController.logout=function(req,res){
	//清空session里的user
req.session.user=null;
res.redirect('/admin/login');
}

// error
adminController.error = function(req,res){
	res.render('admin/error');
}

//友情链接
adminController.linkAdd=function(req,res){
	if(!req.session.user)res.redirect('/admin/login');
	res.render('admin/linkAdd')
}
//友情链接添加
adminController.linkInsert=function(req,res){
	// 插入数据
	linkModel.create(req.body,function(err){
		if(err){
			res.render('admin/error',{errText:'插入数据失败'});
		}else{
             res.redirect('/admin/linkList');
		}
	})
}
//友情链接列表
adminController.linkList=function(req,res){
	linkModel.find({},function(err,data){
		if(err){
			res.render('admin/err',{errText:"查询数据失败"});
		}else{
			if(!req.session.user)res.redirect('/admin/login');
			//响应面板
			res.render('admin/linkList',{datas:data});
		}

	})
}
//友情链接编辑页面
adminController.linkEdit=function(req,res){
	//查询数据
	linkModel.findById({_id:req.params._id},function(err,data){
		if(err){
			res.send(err);
			console.log('进入失败');
		}else{
			if(!req.session.user)res.redirect('/admin/login');
			res.render("admin/linkEdit",{datas:data});
		}

	})
}

//友情链接更改
adminController.linkUpdate=function(req,res){

	linkModel.update({_id:req.body._id},req.body,function(err){
		if(err){
			res.render('admin/error',{errText:'修改数据失败'});
		}else{
			res.redirect("/admin/linkList");

		}
	})
}
//友情链接删除
adminController.linkRemove=function(req,res){
	linkModel.remove({_id:req.params._id},function(err){
		if(err){
			res.render('admin/error',{errText:'删除失败'});
		}else{
			res.redirect("/admin/linkList")
		}
	})
}
//暴露控制器
module.exports=adminController;