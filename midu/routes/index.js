var express = require('express');
var router = express.Router();
//引入首页控制器
var indexController=require('../controllers/indexController.js');

// 首页
router.get('/',indexController.index);
//文章列表页
router.get('/info/:_id',indexController.info);
//文章详情页
router.get('/share',indexController.share);
//详情列表
router.get('/xqList/:_id',indexController.xqList);
module.exports = router;
