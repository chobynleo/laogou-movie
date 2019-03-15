'use strict';

var mongoose = require('mongoose'),
    MovieSee = mongoose.model('MovieSee');   // 电影记录观看模型


// 电影话题后台录入控制器
exports.save = function(req,res) {
  // 获取客户端Ajax发送的URL值中的id值
  var userId = req.query.userId,           // 获取该用户的id值
    movieId = req.query.movieId,           // 获取该电影的id值
    seeId = req.query.seeId;               // 0表示想看 1表示已看
  console.log('-用户id-'+userId+'-电影id-'+movieId+'-see id-'+seeId)
  MovieSee
    .findOne({movie:movieId})
    .exec(function(err,seebody) {
      if (seebody){
        //存在数据
        var __see = {
          author: userId,
          isSee: seeId > 0
        };
        seebody.see = seebody.see.concat(__see);
        seebody.save(function (err, seebodys) {
          if (err) {
            console.log(err);
          }
          // 在数据库中保存用户回复后会生成一条该评论的_id，服务器查找该_id对应的值返回给客户端
          MovieSee
            .findOne({movie: movieId})
            .populate('see.author','name')// 查找话题评论人的名字
            .exec(function (err, seeBody) {
              //console.log('--console.log(seebodys.see);---');
              //console.log(seebodys.see);
              var _name = seeBody.see[seeBody.see.length-1].author.name;
              res.json({msg:seeId,name:_name,createAt:'刚刚'})
            });
        })
      } else{
        //console.log('新建');
        //需新建
        var _see = {
          movie:movieId,
          see:[{
            author: userId,
            isSee: seeId > 0
        }]
        };
        var see = new MovieSee(_see);
        see.save(function (err, seebody) {
          if (err) {
            console.log(err);
          }
          // 在数据库中保存用户回复后会生成一条该评论的_id，服务器查找该_id对应的值返回给客户端
          MovieSee
            .findOne({movie: movieId})
            .populate('see.author','name')// 查找话题评论人的名字
            .exec(function (err, seeBody) {
              var _name = seeBody.see[seeBody.see.length-1].author.name;
              res.json({msg:seeId,name:_name,createAt:'刚刚'})
            });
        })
      }
    });
};


