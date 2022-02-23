# My React Music-163

一个使用 React、TypeScript 开发的，模仿网易云音乐 Mac 客户端的 webAPP 播放器

## 项目体验地址

<https://music163-unclebloom.vercel.app>
<https://music163-git-main-unclebloom.vercel.app>
<https://music163-flame.vercel.app>

## 功能列表

- **播放功能**

  - [x] 设置播放模式（随机播放/列表循环/单曲循环）
  - [x] 设置播放音量
  - [x] 拖动/点击进度条改变播放进度
  - [x] 随机播放模式下记录播放历史
  - [x] 随机播放模式下不连续播放同一首歌曲

- **播放列表展示**

  - [x] 展示所有歌曲
  - [x] 从播放列表移除歌曲

- **导航栏**

  - [x] 切换页面
  - [x] 路由前进后退

- **发现页**
  - [x] banner
  - [x] 推荐歌单 *- 点击设为播放队列*
  - [x] 新歌推荐 *- 点击加入播放队列*

- **搜索页**

  - [x] 展示搜索结果

- **播放详情页**

  - [x] 歌词自动滚动
  - [x] 分页展示歌曲评论
  - [x] 点赞/取消点赞歌曲评论

- [ ] 登录
- [ ] 发现页的歌单、排行榜等页面
- [ ] MV 播放功能与详情页面
- [ ] ...

> PS：部分歌曲因版权限制只能播放 30s 片段。

## 技术栈

- React，使用原生 react hooks 状态管理
- TypeScript，对开发过程进行类型约束
- antd 组件库，主要使用 popover、drawer 组件
- 渐进地使用 Sass 代替 CSS
- Webpack
- ESLint

## API 接口

使用开源的 NeteaseCloudMusicApi
部署地址：<https://music163-api.vercel.app>
API 源码仓库：<https://github.com/Binaryify/NeteaseCloudMusicApi>

## 播放器截图

## 项目启动

- 将仓库 clone 到本地
- cd 到项目目录，安装依赖包
  `npm install`
- 启动服务
  `npm run start`/`npm start`
- 在浏览器中打开 `https://localhost:3000`