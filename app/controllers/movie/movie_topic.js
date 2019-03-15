'use strict';

var mongoose = require('mongoose'),
    MovieTopic = mongoose.model('MovieTopic');   // 电影话题模型

var moment = require('moment'); //引入时间模型

// 电影话题后台录入控制器
exports.save = function(req,res) {
    var _topic = req.body.topic;        					 // 获取post发送的数据
    console.log('后台分析数据');
    // 将用户评论创建新对象并保存
    var topic = new MovieTopic(_topic);
    topic.save(function(err,topic) {
        if(err){
            console.log(err);
        }
        // 在数据库中保存用户评论后会生成一条该话题的_id，服务器查找该_id对应的值返回给客户端
        MovieTopic
            .findOne({_id:topic._id})
            .exec(function(err,topic) {
              var createAt = moment(topic.meta.createAt).format('MM-DD HH:mm');
                res.json({data:topic,createAt:createAt});
            });
    });
};


// 电影话题评论后台录入控制器
exports.add = function(req,res) {
  var _topicComment = req.body.topicComment;        					 // 获取post发送的数据
  console.log('-----------------add---------------');
  console.log(_topicComment)

  // 如果存在cid说明是对评论人进行回复
  if(_topicComment.cid) {
    // 通过点击回复一条电影评论的id，找到这条评论的内容
    MovieTopic.findById(_topicComment.topicId,function(err,topics) {
      var topicCommentsReply = {
        from: _topicComment.from,                			 		// 回复人
        to: _topicComment.tid,                            // 被评论人
        content:  _topicComment.content,         					// 回复内容
        meta:{
          createAt: Date.now()
        }
      };
      topics.comments[_topicComment.cid].reply = topics.comments[_topicComment.cid].reply.concat(topicCommentsReply);    // 添加到话题评论楼层内回复的数组中
      topics.save(function(err,topicComment) {
        if(err){
          console.log(err);
        }
        // 在数据库中保存用户回复后会生成一条该评论的_id，服务器查找该_id对应的值返回给客户端
        MovieTopic
          .findOne({_id:topicComment._id})
          .populate('comments.reply.from comments.reply.to','name')// 查找话题评论人的名字
          .exec(function(err,topicComments) {
            var _commentsReplyId  = topicComments.comments[_topicComment.cid].reply.length-1;
            var _createAt = moment(topicComments.comments[_topicComment.cid].reply[_commentsReplyId].meta.createAt).format('MM-DD HH:mm');
            // 把评论是第几楼层、话题id,创建时间添加到话题评论回复的数组中
            res.json({msg:0,data:topicComments.comments[_topicComment.cid].reply[_commentsReplyId],commentsId: _topicComment.cid,commentsReplyId:_commentsReplyId,topicId:topicComment._id,createAt:_createAt,crId:_commentsReplyId});
          });
      });
    });
    // 简单的评论，不是对评论内容的回复
  }else{
    MovieTopic
      .findOne({_id:_topicComment.topicId})
      .exec(function(err,topics) {
        var topicComments = {
          from:_topicComment.from,                			 		// 回复人
          reply:[],                   					            // 回复内容
          content:_topicComment.content,         					  // 评论内容
          meta:{
            createAt: Date.now()
          }
        };
        topics.comments = topics.comments.concat(topicComments);          					// 添加到话题评论的数组中
        topics.save(function(err,topicComment) {
          if(err){
            console.log(err);
          }
        // 在数据库中保存话题评论后会生成一条该评论的_id，服务器查找该_id对应的值返回给客户端
        MovieTopic
          .findOne({_id:topicComment._id})
          .populate('comments.from','name')// 查找话题评论人的名字
          .exec(function(err,topicComments) {
            var _commentsId  = topicComments.comments.length-1;
            var _createAt = moment(topicComments.meta.createAt).format('MM-DD HH:mm');
            // 把评论是第几楼层、话题id,创建时间添加到话题评论的数组中
            res.json({msg:1,data:topicComments.comments[_commentsId],commentsId:_commentsId,topicId:topicComment._id,createAt:_createAt});
        });
      });
    });
  }
};

// 删除电影评论控制器
exports.del = function(req,res) {
  // 获取客户端Ajax发送的URL值中的id值
  var topicid = req.query.topicid;                     // 获取话题评论楼层回复的id值
  console.log(1);
  console.log(topicid);
  MovieTopic.remove({_id:topicid},function(err) {
    if(err){
      console.log(err);
    }console.log('chonga')
    res.json({success:1});
  });
};
