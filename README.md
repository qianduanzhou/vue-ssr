## 这是一个vue服务端渲染的demo
### 一.介绍
#### 启动
1.clone下来代码后执行npm i安装相关依赖
2.通过package.json里的命令执行程序
#### package.json命令
1.dev 通过npm run dev可启动本地环境开发，RENDER_ROUTER参数设置为true代表使用路由动态生成
2.build 打包客户端和服务端两个包，服务端渲染需要区分客户端和服务端
3.build:renderRouter 启动动态路由打包模式，即先执行一遍路由生成
4.build:analyzer 启动包分析模式，通过插件可分析打包后生成的包的信息