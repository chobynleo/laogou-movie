使用NodeJs+MongoDB+Vue+ES6+jQuery+Webpack搭建的酪枸电影网站
================================================

简介:
---------------
基于Node.js的电影网站注重社区中对于电影文化的探讨。电影网站就是为了能够将各类电影爱好者通过网络连接起来，形成一个庞大的关系网，在这里，可以查看最新电影咨询，和朋友分享电影新的，记录你的电影足迹，将每个人的回忆都记录在此。

技术说明:
---------------
该项目使用Webpack实现简单的资源模块管理；前端一部分使用jQuery操作DOM的JS脚本，另一部分使用了ES6完成Vue组件的编写；后端使用NodeJs编写路由；数据库使用了MongoDB对数据进行管理。

项目整体效果
-------
<div>
  <img src="http://oh1orcwqb.bkt.clouddn.com/doubanMovie.jpeg" width="45%" float"left" height="700" alt="电影首页"/>
</div>
<div text-align="center">
  <img src="http://oh1orcwqb.bkt.clouddn.com/doubanDetail.jpeg" width="45%" alt="电影详情"/>
</div>

动态效果演示
-------
[动态效果演示](http://oh1orcwqb.bkt.clouddn.com/douban.gif)

注意
-------
修改public/js/components 目录下的组件代码时要运行**webpack -w** 命令对文件进行重新编译。

项目结构:
----
```
├── app.js                                  项目入口文件
├── app                                     Node后端MVC文件目录
│   ├── controllers                         控制器目录
│   │   ├── movie                           电影页面控制器目录
│   │   ├── music                           音乐页面控制器目录
│   │   └── user                            用户列表控制器目录
│   ├── models                              模型目录
│   │   ├── movie
│   │   ├── music
│   │   └── user
│   ├── schemas                             模式目录
│   │   ├── movie
│   │   ├── music
│   │   └── user
│   └── views                               视图文件目录
│       ├── includes
│       └── pages
├── doubanDatabase                          供参考的数据库数据
│   └── douban
├── node_modules                            node模块目录
├── public                                  静态文件目录
│   ├── images                              图片目录
│   │   ├── includes                        公共图片目录
│   │   ├── movie
│   │   ├── music
│   │   └── user
│   ├── libs                                经过gulp处理后文件所在目录
│   │   ├── css
│   │   ├── images
│   │   └── scripts
│   ├── sass                                样式目录
│   │   ├── include
│   │   ├── movie
│   │   └── music
│   ├── scripts                             JS脚本目录
│   │   ├──js
│   │     └── components Vue组件目录
│   │       ├── movie
│   │       │   ├── ChooseMovieItem.vue     选电影/电视剧区域子组件
│   │       │   ├── ChooseMovies.vue        选电影/电视剧区域父组件
│   │       │   ├── ChooseMoviesTitle.vue   选电影/电视剧区域标题组件
│   │       │   └── movie_index.js          电影首页脚本
│   │       └── music
│   │           ├── ArtistSongItem.vue      本周单曲榜区域子组件
│   │           ├── ArtistSongs.vue         本周单曲榜区域父组件
│   │           ├── HotProMusicItem.vue     近期热门歌单音乐组件
│   │           ├── HotProgrammeItem.vue    近期热门歌单子组件
│   │           ├── HotProgrammes.vue       近期热门歌单父组件
│   │           ├── NewAlbumItem.vue        新碟榜子组件
│   │           ├── NewAlbums.vue           新碟榜父组件
│   │           ├── Title.vue               标题组件
│   │           └── music_index.js          音乐首页脚本
│   └── upload                              用户自定义上传图片存储目录
│       ├── movie
│       └── music
├── route                                   路由目录
│   └── router.js
├── test                                    测试文件目录
│   └── user
│       └── user.js
├── README.md
├── gulpfile.js                             gulp文件
├── package.json
└── webpack.config.js
```

后期完善:
-------
1. 将全部页面用Vue.js进重构;
