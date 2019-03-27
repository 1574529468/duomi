//图片上传的配置文件
//获取唯一数
var uid=require('uid');
//引入文件上传文件
var multer  = require('multer');
var path=require('path');
//格式化时间
const timestamp = require('time-stamp');

// imgPath  保存图片的路径  String
// imgType  允许图片上传的类型  String  如['image/jpeg','image/png','image/gif'];
// imgfilesize  允许保存图片的大小  Number  单位:字节
// 返回值: upload     Object   multer的对象

function uploadImage(imagePath,imageType,fileSize){
    
var storage = multer.diskStorage({
    //接收文件的路径
    destination: function (req, file, cb) {
      cb(null, imagePath);
    },
    filename: function (req, file, cb) {
      console.log(file);
     
     var extname= path.extname( file.originalname);
      // cb(null, file.fieldname + '-' + Date.now()+extname);
       // 文件重新名字
       cb(null, timestamp('YYYYMMDD')+uid(4)+'_'+extname);
    }
  })
  
  //过滤函数
  function fileFilter (req, file, cb) {
  
    console.log(file);
   
    // 判断用户上传的图片 是不是我们要的
    if(imageType.indexOf(file.mimetype)==-1){
      // 拒绝这个文件
      cb(null, false)
      cb(new Error('请上传 jpeg ping 和 gif 格式的图片'))
    }else{
      // 接受这个文件
      cb(null, true)
    }
  }
  //配置文件上传参数
  var upload = multer({ 
    //基本的配置
    storage: storage,
    //过滤函数
    fileFilter:fileFilter,
    //过滤文件大小
    limits:{
      fileSize:fileSize 
    }
   })
  return upload;
}
//暴露函数
module.exports=uploadImage