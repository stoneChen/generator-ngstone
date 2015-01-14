# generator-ngstone
used to build a **AngularJS** project scaffolding.

> [Yeoman](http://yeoman.io) generator


##这是个什么东东？

这是一个用于生成Angular项目脚手架的**工具**，在你项目的整个生命周期都可以使用它，包括初始化组件下载（通过bower），创建controller，directive等，以及Gruntfile.js（构建，测试流程都准备好），目的就是大大提高我们的开发效率。它本质上也是一个nodejs的程序包，由yo调用，那yo又是什么呢?  
yo是用于各种generator的基础工具，不仅仅可以用于Angular，甚至其他语言的项目脚手架也可以生成。在你用过之后，很可能也会有激情自己也去写一个generator.

##它是怎么来的

拜读过大漠前辈的《用AngularJS开发下一代web应用》，里面提到了yeoman（yo）这个工具。上网查了一下，是一个很牛X的东西。官网提供了angular的generator，我安装后，在实际项目中使用起来非常爽，不过还是有很多地方想要有自己的定制，于是就参照官方的generator-angular花了一个多星期研究，终于诞生了第一版，然后就开始写文档了。欢迎fork，欢迎提出宝贵的意见~

##项目说明

##如何使用

因为这是一个npm程序包，所以它要运行在nodejs环境，安装nodejs的步骤，这里略过。

###1.安装yo bower generator-ngstone

```bash  
npm install -g yo bower generator-ngstone
```

###2.初始化你的项目

找一个合适的地方创建你的项目根目录(比如bookstore)：  

```bash  
mkdir bookstore && cd $_
```

初始化：  
```bash
yo ngstone
```
这里会提示“是否初始化基础服务与布局?”,如果选择是，将会**深度**创建一系列的基础service和指令供你使用，还会初始化样式，这套基础服务与布局，适合比较开发桌面管理系统，如果是移动端项目，还需要作一些修改。