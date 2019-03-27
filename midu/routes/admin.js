//管理员的路由
var express = require('express');
var router = express.Router();

//引入管理员的控制器
var adminController=require('../controllers/adminController.js');
/* 首页 */
router.get('/',adminController.index );
//添加栏目
router.get('/itemAdd',adminController.itemAdd)
//添加栏目数据
router.post('/itmeInsert',adminController.itmeInsert);
//栏目列表
router.get('/itemList',adminController.itemList);
//栏目编辑
router.get('/itemEdit/:_id',adminController.itemEdit);
//栏目更新
router.post('/itemUpdate',adminController.itemUpdate);
//栏目删除
router.get('/itemRemove/:_id',adminController.itemRemove);

// 发布文章
router.get('/articleAdd',adminController.articleAdd);
//插入文章
router.post('/articleInsert',adminController.articleInsert);
//文章列表
router.get('/articleList',adminController.articleList);
//推荐文章
router.get('/tuijianList',adminController.tuijianList);
//文章编辑
router.get('/articleEdit/:_id',adminController.articleEdit);
//文章更新
router.post('/articleUpdate',adminController.articleUpdate);
// 传输文章封面
router.get('/articleImageUpdate/:_id',adminController.articleImage);
// 更新文章内容
router.post('/articleImageUpdate',adminController.articleImageUpdate);

//文章删除
router.get('/articleRemove/:_id',adminController.articleRemove);

//添加管理员
router.get('/adminadd',adminController.adminadd);
router.post('/adminInsert',adminController.adminInsert);
//管理员列表
router.get('/adminList',adminController.adminList);
//管理员修改
router.get('/adminEdit/:_id',adminController.adminEdit);
//管理员更新
router.post('/adminUpdate',adminController.adminUpdate);
//管理员删除
router.get('/adminRemove/:_id',adminController.adminRemove);
//验证码
router.get('/code',adminController.code);

//管理员登录页面
router.get('/login',adminController.login);
//登录操作
router.post('/dlogin',adminController.dlogin);
//退出当前登录
router.get('/logout',adminController.logout)

// Error 的页面
router.get('/error',adminController.error);

//友情链接页面
router.get('/linkAdd',adminController.linkAdd);
router.post('/linkInsert',adminController.linkInsert);

//友情链接列表
router.get('/linkList',adminController.linkList);
//友情链接编辑
router.get('/linkEdit/:_id',adminController.linkEdit);
//友情链接更新
router.post('/linkUpdate',adminController.linkUpdate);
//友情链接删除
router.get('/linkRemove/:_id',adminController.linkRemove);
module.exports = router;
