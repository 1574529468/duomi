//管理员功能的控制
var indexController={};
//引入栏目数据模型
var itemModel=require('../models/itemModel.js');
var articleModel=require('../models/articleModel.js');
var linkModel=require('../models/linkModel.js');
//首页
indexController.index=function(req,res){
    //查询栏目数据
    itemModel.find({}).sort({order:1}).exec(function(err,items){
        if(err){
            res.send('查询数据失败');
        }else{
            console.log(items);
            //查询栏目下的文章
            getItemArticles(0)
            function getItemArticles(index){
                //查询数据
                articleModel.find({itemId:items[index]._id}).limit(1).exec(function(err,aritcles){
                    items[index].articles=aritcles;
                    //判断是不是最后一条数据
                    if(index<items.length-1){
                        //查一个栏目 对应的文章
                        getItemArticles(++index);
                    }else{  
                        // console.log(items[0]);
                        //响应模板
                        //查询文章数据
                        articleModel.find({tuijian:0}).populate('itemId',{name:1}).limit(5).exec(function(err,data){
                            if(err){
                                res.send('查询数据失败');
                            }else{
                                
                        //友情链接
                            linkModel.find({},function(err,item){
                                if(err){
                                    res.send('查询数据失败');
                                }else{
                        //查询推荐
                        articleModel.find({tuijian:0}).populate('itemId',{name:1}).exec(function(err,ldata){
                            if(err){
                                res.send('查询数据失败');
                            }else{

                                //响应模板
                                res.render('index',{items:items,data:data,item:item,datas:ldata});
                            }
                        })       
                                }
                            })
                               
                            }
                        })
                    }
                })
            }
        }
    })

			
		
	
}


//详情页
indexController.info=function(req,res){
    //查询栏目数据
    itemModel.find({}).sort({order:1}).exec(function(err,items){
        if(err){
            res.send('查询栏目数据失败');
        }else{
            console.log(items);
            //查询栏目下的文章
            getItemArticles(0)
            function getItemArticles(index){
                //查询数据
                articleModel.find({itemId:items[index]._id}).limit(5).exec(function(err,aritcles){
                    items[index].articles=aritcles;
                    //判断是不是最后一条数据
                    if(index<items.length-1){
                        //查一个栏目 对应的文章
                        getItemArticles(++index);
                    }else{
                         //推荐
                articleModel.find({tuijian:0}).populate('itemId',{name:1}).exec(function(err,info){
                    if(err){
                        res.send('查询数据失败');
                    }else{

                        articleModel.findById({_id:req.params._id},function(err,iteminfo){
                            if(err){
                                res.send('查询失败');
                            } else { 
                                res.render('info',{items:items,info:info,iteminfo:iteminfo});
                            }
                        })
                        
                
                    }
                }) 
                    }
                })
            }
        }
    })
}

//列表页
indexController.share=function(req,res){
//查询栏目数据
itemModel.find({}).sort({order:1}).exec(function(err,items){
if(err){
    res.send('查询数据失败');
}else{
    console.log(items);
    //查询栏目下的文章
    getItemArticles(0)
    function getItemArticles(index){
        //查询数据
        articleModel.find({itemId:items[index]._id}).limit(2).exec(function(err,aritcles){
            items[index].articles=aritcles;
            //判断是不是最后一条数据
            if(index<items.length-1){
                //查一个栏目 对应的文章
                getItemArticles(++index);
            }else{
                //推荐
                articleModel.find({tuijian:0}).populate('itemId',{name:1}).exec(function(err,datal){
                    if(err){
                        res.send('查询栏目数据失败');
                    }else{
                        res.render('share',{items:items,datal:datal}); 
                
                    }
                })  
            
            }
        })
    }
}
    })
}

//详情列表
indexController.xqList=function(req,res){
    //查询栏目数据
itemModel.find({}).sort({order:1}).exec(function(err,items){
    if(err){
        res.send('查询数据失败');
    }else{
        console.log(items);
        //查询栏目下的文章
        getItemArticles(0)
        function getItemArticles(index){
            //查询数据
            articleModel.find({itemId:items[index]._id}).limit(2).exec(function(err,aritcles){
                items[index].articles=aritcles;
                //判断是不是最后一条数据
                if(index<items.length-1){
                    //查一个栏目 对应的文章
                    getItemArticles(++index);
                }else{
                    //推荐
                    articleModel.find({tuijian:0}).populate('itemId',{name:1}).exec(function(err,datal){
                        if(err){
                            res.send('查询数据失败');
                        }else{
                            articleModel.find({itemId:req.params._id},function(err,xqList){
                                if(err){
                                    res.send(err);
                                }else{
                                    //查询栏目数据
                        itemModel.find({_id:req.params._id},function(err,xqdata){  
                            // res.send(req.params._id);
                            if(err){
                                res.send('查询栏目数据失败');
                            }else{
                                res.render('xqList',{items:items,datal:datal,xqList:xqList,xqdata:xqdata[0]}); 
                            }

                        }) 
                             }
                             }) 
                        }
                    })  
                
                }
            })
        }
    }
        })
}
//暴露控制器
module.exports=indexController;