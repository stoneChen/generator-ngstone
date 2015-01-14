# generator-ngstone
used to build a **AngularJS** project scaffolding.

> [Yeoman](http://yeoman.io) generator


##这是个什么东东？

这是一个用于生成Angular项目脚手架的**工具**，在你项目的整个生命周期都可以使用它，包括初始化，生成指定模块，就是用命令行完成我们以前需要人肉完成的重复劳动。目的就是大大提高我们的开发效率。它本质上也是一个nodejs的程序包，由yo调用，那yo又是什么呢?  
yo是用于各种generator的基础工具，不仅仅可以用于Angular，甚至其他语言的项目脚手架也可以生成。在你用过之后，很可能也会有激情自己也去写一个generator.

##它是怎么来的

拜读过大漠前辈的《用AngularJS开发下一代web应用》，里面提到了yeoman（yo）这个工具。上网查了一下，是一个很牛X的东西。官网提供了angular的generator，我安装后，在实际项目中使用起来非常爽，不过还是有很多地方想要有自己的定制，于是就参照官方的generator-angular花了一个多星期研究，终于诞生了第一版，然后就开始写文档了。欢迎fork，欢迎提出宝贵的意见~

##项目说明

本项目参考[generator-angular](https://github.com/yeoman/generator-angular)完成开发。在很多细节考虑不如官方的周全，而且很多地方作了删减，以后会逐步完善。  
  
* 浏览器兼容性：不考虑低版本IE，建议限定目标用户使用webkit系浏览器。
* 样式方案采用less，由于本人使用webstorm IDE，有内置自动编译插件，所以gruntfile里就不添加less任务了  
  
本工具生成的Angular项目，默认安装以下模块（暂不可更改）：

1. bootstrap#3.3.0
2. fontawesome~4.2.x
3. jquery~2.1.0
4. angular~1.2.0
5. angular-sanitize~1.2.0
6. angular-animate~1.2.0
7. angular-route~1.2.0
8. angular-bootstrap~1.2.0  

本项目抛弃了官方的resource模块，因为在ajax请求上，本人需要一些定制，所以参照官方的resource自己写了一个~  
顺便说明，本项目ajax请求遵循RESTful风格，resource同样也是如此。


###功能 

* 初始化项目目录结构，下载开源组件（通过bower），下载npm模块，生成Gruntfile.js  
* 通过命令生成controller，directive，factory，filter，decorator以及相应的测试文件  


以下功能与本工具无直接关系，只不过是事先在gruntfile里做好了相应的配置，命令只是把gruntfile拷贝到你的项目里。如果你觉得好用，拷贝到别的项目里也是可用的~  

* Gruntfile内容已经写入了一个完整可用的开发，构建，测试流程。只需执行相应grunt的命令即可。
* 本项目设置了一个简单的数据模拟机制，开发时无需依赖后端，后面会继续讲到

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
我们这里先选择n，初始化简单版的项目基础。  
由于工具会调用`bower install` 和 `npm install`下载组件和模块，可能过程会比较慢，由你当前的网速而定~  
初始化完成后，你会发现bookstore下，生成了很多目录与文件。  
简单介绍一下：  

```
app/ //项目的html，js，less，css都在这里    mock/  //无后端开发时，需要模拟数据，所有的数据模拟文件都在这里test/  //所有的测试文件与配置都在这里  bower_components/  //bower安装的组件都在这里  node_modules/ //所有node模块都在这里 bower.json //bower配置文件  Gruntfile.js  //不解释了~  package.json  //不解释了~README.md  //不解释了~  
```
本来想把.gitignore也添加进来的，想想有些同学不是用git的，那么这个文件也就多余了，有需要的同学就自行添加吧。  
###3.启动服务器
还是在bookstore的目录下：
```bashgrunt serve
```
这会调用grunt任务，很快就会调用你的默认浏览器，并打开 http://localhost:9000/ 这个网址。  
如果你看到页面上有一个可爱的小胡子，以及下面的这样一句话：  
this is the main view. to be continued...  
那么恭喜你成功初始化了一个Angular项目！