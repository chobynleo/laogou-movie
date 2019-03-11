'use strict';

$.support.cors = true;                                  // 解决IE8/9 Ajax跨域请求问题

$(function() {

  // 格式化时间函数
  function padding(number) {
    return number < 10 ? '0' + number : '' + number;
  }
  function format(date) {
    return padding(date.getMonth() + 1) + '-' + padding(date.getDate()) + ' ' + padding(date.getHours()) + ':' + padding(date.getMinutes());
  }

  // 设置酪枸电影评分图片的样式
  // 获取该电影的酪枸评分来设置图片的Y轴位置，显示相应评分对象的星星数

  var movieStar = Math.ceil($('.rating-num strong').html() - 10) * 15;
  $('.star').css('background-position-y', movieStar);

  // 评论区回复评论事件
  $('#mediaList').on('click','.comment',function(event) {
    event.preventDefault();
    var target = $(this),                     // 获取点击回复的评论对象
        toId = target.data('tid'),            // 被评论人的ID值
        commentId = target.data('cid');       // 该条评论内容的ID值
    // 给当前要叠楼回复的楼主添加ID值
    $(target).parents('.media-body').attr('id','mediaBody');
    if($('#toId').length > 0) {
      $('#toId').val(toId);
    }else {
      $('<input>').attr({
        type: 'hidden',
        id: 'toId',
        name: 'comment[tid]',
        value: toId                             // 被评论人ID
      }).appendTo('#commentForm');
    }

    if($('#commentId').length > 0) {
      $('#commentId').val(commentId);
    }else {
      $('<input>').attr({
        type: 'hidden',
        id: 'commentId',
        name: 'comment[cid]',
        value: commentId                         // 该评论，即该叠楼在数据库中的ID
      }).appendTo('#commentForm');
    }
    //聚焦
    $('#comments textarea').focus();
  });


  // 评论区提交评论点击事件
  $('#comments button').on('click',function(event) {
    // 阻止表单默认发送到服务器行为并发送Ajax请求
    event.preventDefault();
    $.ajax({
      url: '/admin/movie/movieComment',
      type: 'POST',
      // 将第一第二隐藏表单中保存的电影ID和用户ID值及评论内容发送给服务器
      data: {
          'comment[movie]':$('#comments input[name="comment[movie]"]').val(), // 电影ID
          'comment[from]':$('#comments input[name="comment[from]"]').val(),   // 回复人ID
          'comment[content]':$('#comments textarea').val(),                   // 评论内容
          // 若点击回复按钮对评论进行回复，就会生成两个隐藏的表单，分别有被回复人ID和点击该条评论的ID
          'comment[tid]':$('#toId').val(),                									// 被回复人ID
          'comment[cid]':$('#commentId').val()            									// 被点击评论的ID
      }
    }).done(function(results) {
      var data = results.data || {};
      console.log(data)
      // 如果是对评论进行回复
      if(data.reply.length) {
        var len = data.reply.length;                      // 回复评论人的条数
        $('#mediaBody').append('<div class="media"><div class="media-left"><img src="/libs/images/user/headImg.png" style="width: 30px; height: 30px;"/></div><div class="media-body"><h4  class="media-heading">' + data.reply[len-1].from.name + '<span>&nbsp;回复&nbsp;</span>' + data.reply[len-1].to.name + '</h4><p>' + data.reply[len-1].content + '</p><span class="createAt">' + format(new Date()) + '</span>&nbsp;&nbsp;&nbsp;&nbsp;<a class="comment" href="#comments" data-cid=' + data._id + ' data-tid=' + data.reply[len-1].to._id + '> 回复</a>&nbsp;|&nbsp;<a class="comment-del" href="javascript:;" data-cid=' + data._id + ' data-did=' + data.reply[len-1]._id + '>删除</a></div></div>');
        // 如果是发表新评论
      }else {
        $('#mediaList').append('<li class="media"><div class="media-left"><img src="/libs/images/user/headImg.png" style="width: 40px; height: 40px;" /></div><div class="media-body"><h4 class="media-heading">' + data.from.name + '</h4><p>' + data.content + '</p><span class="createAt">' + format(new Date()) + '</span>&nbsp;&nbsp;&nbsp;&nbsp;<a class="comment" href="#comments" data-cid=' + data._id + ' data-tid=' + data.from._id + '> 回复</a>&nbsp;|&nbsp;<a class="comment-del" href="javascript:;" data-cid=' + data._id + '>删除</a></div><hr></li>');
        // 获取评论数量的节点并加一
        try {
            var commentLength = $('#comment-length');
            commentLength.html(parseInt(commentLength.html()) + 1);
        }catch (e) {
            console.log(e)
        }

      }

      $('#comments textarea').val('');  // 发表评论后清空评论框内容
      // 给叠楼回复内容完后要删除给叠楼楼主添加的ID值，方便下次点击其他叠楼楼主继续添加该ID
      $('#mediaBody').removeAttr('id');
      // 同样将叠楼评论中新建的两个隐藏表单清空，方便下次回复新内容时不会堆叠到此楼
      $('#commentForm input:gt(1)').remove();
    });
  });

  // 删除评论功能
  $('#mediaList').on('click','.comment-del',function(event) {
    var $omediaBody = $(this).parent('.media-body');		// 获取点击删除a元素的父节点
    var cid = $(event.target).data('cid');  						// 获取该删除评论的id
    // 如果点击的是叠楼中的回复评论还要获取该回复评论的自身id值
    var did = $(event.target).data('did');

    $.ajax({
      url: '/movie/:id?cid='+cid+'&did='+did,
      type: 'DELETE',
    }).done(function(results) {
      if(results.success === 1) {
        // 获取.media-body的父节点并删除
        $omediaBody.parent().remove();
        // 获取评论数量的节点并减一
        try {
            var commentLength = $('#comment-length');
            commentLength.html(parseInt(commentLength.html()) - 1);
        }catch (e) {
            console.log(e)
        }

      }
    });
  });
  //关闭话题的显示框
  $('#topic-guide-close').on('click', function(event) {
      $('#topic-guide').hide();
  });

  // 点击发表话题按钮
  $('#publish-toppic-btn').on('click', function(event) {
      $('#topic-publish-modal')
          .modal('show')
      ;
  });
  // 点击展示话题面板的按钮
  $('.show-modal-btn').on('click', function(event) {
    console.log(this.id);
      $('#modal'+this.id)
          .modal('show')
      ;
      $('input').blur();
      // 自食其果，bootstrap和semantic打架了，开modal冲突
      $('#bootstrapJs').hide()
  });

  // 话题区发表按钮点击事件
  $('#publishButton').on('click',function(event) {
      // 阻止表单默认发送到服务器行为并发送Ajax请求
      event.preventDefault();
      $.ajax({
        url: '/admin/movie/movieTopic',
        type: 'POST',
        dataType:"json",
        // 将第一第二隐藏表单中保存的电影ID和用户ID值及评论内容发送给服务器
        data: {
          'topic[movie]':$('#topic-publish-modal input[name="topic[movie]"]').val(),   // 电影ID
          'topic[publisher]':$('#topic-publish-modal input[name="topic[publisher]"]').val(),     // 发表人ID
          'topic[title]':$('#topic-publish-modal input[name="topic[title]"]').val(),   // 发表话题标题
          'topic[body]':$('#topic-publish-modal textarea[name="topic[body]"]').val()     // 发表话题内容
        }
      }).done(function(results) {
          var data = results.data || {};
          var createAt = results.createAt || {};
          //填充topic区域
          $('#topicBody').append('<h3><a id=' + data._id + ' href="javascript:void(0);"'+ 'class="show-modal-btn">' + data.title + '</a></h3>\n' +'<div><span class="tag">' + createAt + '</span><span class="tag right"><span>浏览(4)</span><span>留言(1)</span></span></div><hr>' )
          //为生成的元素绑定监听事件(点击展示话题面板的按钮)
          $('.show-modal-btn:last').on('click', function(event) {
            $('#modal'+ data._id)
              .modal('show')
            ;
            $('input').blur();
            // 自食其果，bootstrap和semantic打架了，开modal冲突
            //$('#bootstrapJs').hide()
          });
          //填充modal区域
          $('#topic-hidden').append('<div id="modal'+data._id+'" class="ui modal publish large long"><i class="close icon"></i>\n' +
            '          <div class="header">' + data.title + '</div>\n' +
            '          <div class="content">\n' +
            '            <form method="post" class="ui form segment">\n' +
            '              <input type="hidden" name="topic[movie]" value="5c3e980c944b741c5097aafc">\n' +
            '              <input type="hidden" name="topic[publisher]" value="5c7e5905434e9b0c308d1371">\n' +
            '              <div class="field">\n' +
            '                <label>内容</label>' + data.body +
            '              </div>\n' +
            '            </form>\n' +
            '          </div>\n' +
            '          <div class="actions">\n' +
            '            <ul class="media-list">\n' +
            '              <li class="media">\n' +
            '                <div class="media-left"><img src="/libs/images/user/headImg.png" style="width: 40px; height: 40px;" class="media-object"></div>\n' +
            '                <div class="media-body">\n' +
            '                  <div class="topicComments">\n' +
            '                    <form method="POST">\n' +
            '                      <input type="hidden" name="topicComment[movie]" value="5c3e980c944b741c5097aafc">\n' +
            '                      <input type="hidden" name="topicComment[topicId]" value="5c7fce0f2ae18018a41b90b5">\n' +
            '                    </form>\n' +
            '                    <input type="hidden" name="topicComment[from]" value="5c7e5905434e9b0c308d1371">\n' +
            '                    <div class="form-group">\n' +
            '                      <textarea name="topicComment[content]" class="form-control"></textarea>\n' +
            '                    </div>\n' +
            '                    <button type="submit" class="btn btn-primary">提交</button>\n' +
            '                  </div>\n' +
            '                </div>\n' +
            '              </li>\n' +
            '            </ul>\n' +
            '          </div>\n' +
            '        </div>');
      });
  });

  //话题中评论区提交评论点击事件
  $('.topicComments button').on('click',function(event) {
    //该话题评论区的ID
    var commentId = this.parentNode.id;
    // 阻止表单默认发送到服务器行为并发送Ajax请求
    event.preventDefault();
    $.ajax({
        url: '/admin/movie/movieTopicComment',
        type: 'POST',
        // 将第一第二隐藏表单中保存的电影ID和用户ID值及评论内容发送给服务器
        data: {
            'topicComment[movie]':$('#'+commentId+' input[name="topicComment[movie]"]').val(), // 电影ID
            'topicComment[topicId]':$('#'+commentId+' input[name="topicComment[topicId]"]').val(),   // 话题ID
            'topicComment[from]':$('#'+commentId+' input[name="topicComment[from]"]').val(),   // 回复人ID
            'topicComment[content]':$('#'+commentId+' textarea').val(),                   // 评论内容
            // 若点击回复按钮对评论进行回复，就会生成两个隐藏的表单，分别有被回复人ID和点击该条评论楼层的ID
            'topicComment[tid]':$('#topicToId').val(),                									// 被回复人ID
            'topicComment[cid]':$('#topicCommentId').val()            									// 被点击评论的ID
        }
    }).done(function(results) {
        if(results.msg === 0) {
          // 如果是对评论进行回复
          var data = results.data || {};             //评论的数据
          $('#topicMediaBody').parent().append('<div class="media">\n' +
            '                      <div class="media-left"><img src="/libs/images/user/headImg.png" style="width: 30px; height: 30px;" class="media-object"></div>\n' +
            '                      <div class="media-body">\n' +
            '                        <h4 class="topic-media-heading"><a>'+ data.from.name +'</a><span>&nbsp;回复&nbsp;</span><a>'+ data.to.name +'</a></h4>\n' +
            '                        <p>'+ data.content +'</p><span class="createAt">'+ results.createAt +' &nbsp;&nbsp;&nbsp;&nbsp;</span><a href="javascript:;" data-cid='+ results.commentsId +' data-crid='+ results.commentsReplyId +' data-tid=' + data.to._id +' data-topicid=' + results.topicId + ' class="topic-comment-reply">&nbsp;|&nbsp;回复</a><a href="javascript:;" data-cid='+ results.commentsId +' data-crid='+ results.commentsReplyId +' data-topicid=' + results.topicId + ' class="topic-comment-del">删除</a>\n' +
            '                      </div>\n' +
            '                    </div>');

          // 给叠楼回复内容完后要删除给叠楼楼主添加的ID值，方便下次点击其他叠楼楼主继续添加该ID
          $('#topicMediaBody').removeAttr('id');
          // 同样将叠楼评论中新建的两个隐藏表单清空，方便下次回复新内容时不会堆叠到此楼
          $('#topicForm'+ results.topicId + ' input:gt(1)').remove();

          $('#modal'+results.topicId+' textarea').val('').focus();  // 发表评论后清空评论框内容
          //重新绑定监听
          bind_topic_listerner()
        }else {
          // 如果是发表新评论
          var data = results.data || {};             //评论的数据
          var commentsId = results.commentsId || {}; //评论楼层
          var topicId = results.topicId || {};       //话题ID
          var createAt = results.createAt || {};     //评论时间
            $('#mediaList' + topicId).append('<li class="media"><div class="media-left"><img src="/libs/images/user/headImg.png" style="width: 40px; height: 40px;" /></div><div class="media-body topic-comment-body"><div class="topic-comment-header"><h4 class="topic-media-heading"><a href="javascript:;">' + data.from.name + '</a><span class="createAt">' + createAt +' &nbsp;&nbsp;&nbsp;&nbsp;</span></h4></div><p class="topic-comment-content">' + data.content + '</p><div class="op-lnks"><a href="#comments" data-cid='+ commentsId + ' data-tid=' + data.from._id + ' data-topicid='+ topicId + ' class="topic-comment-reply">回复</a><a href="javascript:;" data-cid=' + commentsId + ' data-topicid='+ topicId  + ' data-crid='+ results.crId +  ' class="topic-comment-del">删除&nbsp;|&nbsp;</a></div>  </div><hr></li>');
            //重新绑定删除按钮监听
            bind_topic_listerner();
            $('#modal'+topicId+' textarea').val('').focus();  // 发表评论后清空评论框内容
        }

    });
  });

  //话题中的监听事件
  bind_topic_listerner();
  function bind_topic_listerner() {
    //防止重复绑定
    $(".topic-comment-del").off("click");
    $(".topic-comment-reply").off("click");

    // 删除评论功能
    $('.topic-comment-del').on('click',function(event) {

      var $omediaBody = $(this).parent().parent();		// 获取点击删除a元素的父节点
      var topicid = $(event.target).data('topicid');  		// 获取该话题的id
      var cid = $(event.target).data('cid');  						// 获取话题下评论楼层的id
      // 如果点击的是叠楼中的回复评论还要获取该回复评论的自身id值
      var crId = $(event.target).data('crid');
      $.ajax({
        url: '/topicComment/:id?topicid='+topicid+'&cid='+cid+'&crId='+crId,
        type: 'DELETE',
      }).done(function(results) {
        if(results.success === 0) {
          // 获取.media-body的节点并删除
          $omediaBody.remove();
        }else{
          // 获取.media-body的父节点并删除
          $omediaBody.parent().remove();
        }
      });
    });
    //点击回复
    $('.topic-comment-reply').on('click',function(event) {
      event.preventDefault();
      var target = $(this),                  // 获取点击回复的评论对象
        topicid = target.data('topicid'),     // 话题的ID值
        commentId = target.data('cid'),       // 该条评论楼层的ID值
        toId = target.data('tid');            // 被评论人的ID值


      // 给当前要叠楼回复的楼主添加ID值
      if($('#topicMediaBody')){
        $('#topicMediaBody').removeAttr("id");
      }
      $(target).parent().attr('id','topicMediaBody');
      //先把之前的清空
      if($('#topicToId').length > 0) {
        $('#topicToId').remove();
      }
      // 添加被评论人ID
      $('<input>').attr({
        type: 'hidden',
        id: 'topicToId',
        name: 'topicComment[tid]',
        value: toId
      }).appendTo('#topicForm'+topicid);
      //先把之前的清空
      if($('#topicCommentId').length > 0) {
        $('#topicCommentId').remove();
      }
      //添加评论楼层id
      $('<input>').attr({
        type: 'hidden',
        id: 'topicCommentId',
        name: 'topicComment[cid]',
        value: commentId
      }).appendTo('#topicForm'+topicid);

      //textarea区域获取焦点
      $('#modal'+topicid+' textarea').focus();
    })
  }




});
