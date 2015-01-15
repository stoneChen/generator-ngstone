# generator-ngstone
used to build a **AngularJS** project scaffolding.

> [Yeoman](http://yeoman.io) generator


##这是个什么东东？

这是一个用于生成Angular项目工程脚手架的**工具**，在你项目的整个生命周期都可以使用它，包括初始化，生成指定模块，就是用命令行完成我们以前需要人肉完成的重复劳动。目的就是大大提高我们的开发效率,且有利于统一代码风格。它本质上也是一个nodejs的程序包，由yo调用，那yo又是什么呢?  
yo是用于各种generator的基础工具，不仅仅可以用于Angular，甚至其他语言的项目脚手架也可以生成。在你用过之后，很可能也会有激情自己也去写一个generator.

##它是怎么来的

拜读过大漠前辈的《用AngularJS开发下一代web应用》，里面提到了yeoman（yo）这个工具。上网查了一下，是一个很牛X的东西。官网提供了angular的generator，我安装后，在实际项目中使用起来非常爽，不过还是有很多地方想要有自己的定制，于是就参照官方的generator-angular花了一个多星期研究，终于诞生了第一版，然后就开始写文档了。欢迎fork，欢迎提出宝贵的意见~

##工具说明

【名词解释】：  
*目标工程*：指通过本工具生成的Angular项目工程

本工具参考[generator-angular](https://github.com/yeoman/generator-angular)完成开发。在很多细节考虑不如官方的周全，而且很多地方作了简化处理，以后会逐步完善。  
  
* 建议对Angular已经有一定了解之后，再来使用本工具
* 浏览器兼容性：不考虑低版本IE，建议限定目标用户使用webkit系浏览器。
* 样式方案采用less，因为目前很多IDE都有内置自动编译插件（比如本人使用的webstorm），所以gruntfile里就暂不添加less任务了  
  
目标工程安装将以下模块（暂不可更改）：

1. bootstrap#3.3.0
2. fontawesome~4.2.0
3. jquery~2.1.0
4. angular~1.2.0
5. angular-sanitize~1.2.0
6. angular-animate~1.2.0
7. angular-route~1.2.0
8. angular-bootstrap~0.12.0  

---

* 目标工程不使用官方的resource模块，因为在ajax请求上，本人作了一些定制，所以参照官方的resource自己写了一个（基础服务模式自动安装，下面会讲到）~  
* 目标工程ajax请求遵循RESTful风格，resource使然，当然如果你有特殊需求，发送非REST请求也是可以的    
* 目标工程对单元测试方面还需完善，工具本身的自动化测试也需要完善。
* 本工具只是帮助你完成一些基础性的代码，很多细节还需要你自己来把控，千万不要**过度依赖**哦~


###功能 

* 初始化目标工程目录结构，下载开源组件（通过bower），下载npm模块，生成Gruntfile.js  
* 通过命令生成controller，directive，factory，filter，decorator以及相应的测试文件  
* 工具内置 *标准* 与 *安装基础服务与布局* 两种初始化模式，其中 *标准* 模式的功能与官方版大致相同，可根据需要进行选择


以下功能与本工具无直接关系，只不过是事先在gruntfile里做好了相应的配置，命令只是把gruntfile拷贝到你的项目里。如果你觉得好用，拷贝到别的项目里也是可用的~  

* Gruntfile内容已经写入了一个完整可用的开发，构建，测试流程。只需执行相应grunt的命令即可。
* 本项目设置了一个简单的数据模拟机制，开发时无需依赖后端，后面会继续讲到
* 开发过程中，grunt任务会监听所有app下的所有js，css，html和所有数据模拟json文件的内容变化，一旦发生变化立即刷新页面，省去了人工刷新~
* 官方版并没有将模板文件进行打包，只是简单的作了htmlmin，构建后，还是需要通过ajax获取模板，本工具调用了grunt-angular-templates任务将视图文件打包放入angular的$templateCache,构建后即可通过缓存读取模板，提高应用性能  
* 关于angular的依赖注入写法，对angular有一定了解的同学应该都知道，有三种方式 *推测注入* 、 *显式注入* 、 *内联注入*（也有其他的叫法，暂时这么叫吧~），其中 *推测注入* 方式在ugilfy后不可用。但是在目标工程里，我们只需要使用 *推测注入* 即可，也就是通过形参让Angular自己去查找依赖，构建过程中，在ugify之前，会通过grunt-ng-annotate任务把 *推测注入* 改为 *内联注入* ，是不是很方便~不过这是官方版提供的，我把它挪过来了~

##如何使用

因为这是一个npm程序包，所以它要运行在nodejs环境，安装nodejs的步骤，这里略过。

###1.安装yo bower generator-ngstone

```  
npm install -g yo bower generator-ngstone
```

###2.初始化你的项目

找一个合适的地方创建你的项目根目录(比如bookstore，本工具所有命令都是在此根目录下执行)：  

```  
mkdir bookstore && cd $_
```

初始化：  
```
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
```grunt serve
```

这会调用grunt任务，很快就会调用你的默认浏览器，并打开 http://localhost:9000/ 这个网址。  
如果你看到页面上有一个可爱的小胡子，以及下面的这样一句话：  

```
this is the main view. to be continued...  
```

那么恭喜你成功初始化了一个Angular项目！

###4.开发一个新页面
比如我们要开发一个图书list页面，执行：  
```
yo ngstone:route list
```

命令行最后几行提示：  

```
script added into index.html: scripts/controllers/list.js
   create         app/scripts/controllers/list.js
   create         test/spec/controllers/list.js
   create         app/views/list/list.html
```
意思是，添加了引用controller的script标签到index.html，并创建了controller和单元测试文件，以及视图文件。  

然后，回到浏览器，把地址栏里的 http://localhost:9000/#/main 改为 http://localhost:9000/#/list 回车，
你会发现，最下面那句话，之前的main变成了list，也就是  

```
this is the list view. to be continued...  
```

list这个位置的单词是加大字号并加了蓝色的，加以明显的提示和区分。  

怎么样，创建一个新页面是不是很快？  
接下来我们要制作一个图书列表，首先将下面的代码，替换到  app/views/list/list.html 中：  

```html
<table class="table table-bordered table-hover">
    <thead>
    <tr>
        <td>书名</td>
        <td>作者</td>
        <td>价格</td>
    </tr>
    </thead>
    <tbody>
    <tr ng-repeat="book in books">
        <td>{{book.name}}</td>
        <td>{{book.author}}</td>
        <td>{{book.price}}</td>
    </tr>
    </tbody>
</table>
```


此时，如果你回到浏览器，它会自动刷新，你会看到一个表头。
然后，打开app/scripts/controllers/list.js编辑controller,添加一个数组：  


```
angular.module('bookstoreApp')
    .controller('ListCtrl', function ($scope) {
        $scope.books = [
            {
                id:1,
                name:'用AngularJS开发下一代web应用',
                author:'大漠穷秋',
                price:1.20
            },
            {
                id:2,
                name:'浪潮之巅',
                author:'吴军',
                price:1.21
            },
            {
                id:3,
                name:'macTalk',
                author:'池建强',
                price:1.22
            }
        ]
    });
```  
回到浏览器，还是会自动刷新，表格里面显示了刚刚添加的数组的内容。  
刚刚我们是通过手动修改地址栏访问这个list页面的，现在我们修改index.html的导航，通过点击导航的方式访问list页面：  

```html
<ul class="nav nav-pills pull-right">
            <li class="active"><a ng-href="#/">Home</a></li>
            <li><a ng-href="#/list">List</a></li>
        </ul>
```
再回到浏览器，分别点击右上角的Home和List，就可以在主页和list页之前切换了！（这个是Angular的路由功能，已经不是本工具应该讨论的范畴了，就不深入说明了- -）  
这样一个简单的页面就开发完了，是不是很轻松？  

###5.添加directive

指令的生成有2个选项，所以单独拿出来说。比如我们要添加一个叫做hello的指令，执行：  

```
yo ngstone:directive hello
```

控制台会输出：  

```
script added into index.html: scripts/directives/hello.js
   create app/scripts/directives/hello.js
   create test/spec/directives/hello.js
```

在index.html生成script标签,添加指令模块文件和单元测试文件，其中指令模块的内容是不带template选项的：  

```javascript
angular.module('bookstoreApp')
    .directive('hello', function () {
        return {
            restrict:'E',
            replace:true,
            scope:{
            
            },
            link: function ($scope,$element,attrs) {
                
            }
        }
    });
```

如果命令添加一个选项：  

```
yo ngstone:directive hello --template
```

则会添加一个template属性：  

```javascript
angular.module('bookstoreApp')
    .directive('hello', function () {
        return {
            restrict:'E',
            replace:true,
            template:'<div></div>', //添加的template属性
            scope:{
                
            },
            link: function ($scope,$element,attrs) {
                
            }
        }
    });
```

如果选项是 `templateUrl` ：  

```
yo ngstone:directive hello --templateUrl
```

控制台输出：  

```
script added into index.html: scripts/directives/hello.js
   create app/views/_widgets/hello/hello.html
   create app/scripts/directives/hello.js
   create test/spec/directives/hello.js
```

你会发现多了一个视图文件，而且是创建到app/views/_widgets这个目录下的，指令文件内容也相应的变成了：  

```javascript
angular.module('bookstoreApp')
    .directive('hello', function () {
        return {
            restrict:'E',
            replace:true,
            templateUrl:'./views/_widgets/hello/hello.html',
            scope:{
                
            },
            link: function ($scope,$element,attrs) {
                
            }
        }
    });
```

省去了人工配置的麻烦~  
讲完了ngstone:directive的两个选项，接下来让我们完成这个hello指令。假定我使用了外部模板，即使用`--templateUrl` 这个选项创建指令，我们在link函数里写上：  

```
$element.after('<p>Hello Directive!</p>')
```

再在app/views/list/list.html的末尾(table标签后)加上：  

```html
<hello></hello>
```  

回到浏览器查看list页面，你会发现，最下面出现了：  


```
this is the hello view. to be continued...

Hello Directive!
```

表明我们的directive添加成功了！是不是很愉快？

###6.添加factory，filter，decorator

添加它们的命令和directive类似，只不过没有那两个template选项，就不再演示了。。  

另外，provider，service，value，constant我就不额外添加指令了，因为和factory太相似了，而且我个人认为还是factory用的频度最高，而且也够用了。实在不行，生成factory后再稍微改一改，再者它们本质都属于service，问题不大~

还有，decorator特殊一点，它不生成测试文件。  

###6.单元测试

功能开发完毕后要进行单元测试，我们来测试一下刚才写的controller，打开test/spec/controllers/list.js，把最下面的it(...),改成：  

```javascript
it('should attach a list of books to the scope', function () {
        expect(scope.books.length).toBe(4);
    });
```

命令行执行：  

```
grunt test:unit
```

这里会启动*PhantomJS*虚拟浏览器，执行我们的代码。  
执行完毕后，我们会看到类似如下的提示：  

```
PhantomJS 1.9.8 (Mac OS X) Controller: ListCtrl should attach a list of books to the scope FAILED
	Expected 3 to be 4.
	    at /....../bookstore/test/spec/controllers/list.js:20
PhantomJS 1.9.8 (Mac OS X): Executed 2 of 2 (1 FAILED) (0.004 secs / 0.026 secs)
```  
表明我的controller单元测试没有通过. scope.books.length应该为3，而不是4

我们回过去把 `expect(scope.books.length).toBe(4);`最后的4改成3，再运行单元测试，会出现如下结果：  

```
PhantomJS 1.9.8 (Mac OS X): Executed 2 of 2 SUCCESS (0.003 secs / 0.018 secs)

Done, without errors.
```

 好了！这样单元测试就通过了。
 
###7.打包构建工程 

功能开发好后，需要对静态文件作一系列的加工，这样上线后可以为我们带来加快访问速度，提高性能，减少网络流量等好处。接下来我们开始构建：  

```
grunt build
```

这过程做了很多事，视图打包进js（本人添加），依赖注入替换，js、css合并压缩，图片名添加后缀（刷新缓存）等。  
需要说明一下，我把官网版的generator的gruntfile任务流，去掉了图片压缩和css autoprefixer。  
图片压缩用到的grunt任务模块很大，而且windows下会报错，无法构建，因此去掉了它，如果需要图片压缩，请自行添加任务流。  
css autoprefixer为css3添加浏览器前缀，相信很多IDE都能搞定了吧，就不要了它了。  
其他还有一些配置，在官方版的基础上删删改改，现在是可以完成构建任务的~  
至于构建任务流的具体过程，我就先不讲了，有兴趣的同学，可以仔细研究一下，或许我以后会补上来吧。  

控制台唰唰唰的输出一坨日志后，构建完成。你会发现根目录下多出了一个dist目录，里面的内容比之前的简单多了：

```
fonts/   //所有的字体文件，包括bootstrap和fontawesome的
images/  //所有的图片文件，文件名是添加过后缀的
scripts/  //所有的js，是合并压缩过后的，里面只有两个文件，一个是所有的bower组件代码，一个是我们自己写的代码
styles/  //所有的css，同上
index.html //工程首页，是htmlmin过的
```
如果你觉得构建后的js和css还是太多，你完全可以自己动手把它们继续合并~
然后呢，执行：  

```
grunt serve:dist
```

就会以dist为webroot启动服务，同样调用你的默认浏览器打开地址：http://localhost:9000  效果是和不打包构建一样的，性能肯定是更高的！随着你的工程越来越大，性能提升会越来越明显。打开浏览器调试工具，查看请求列表，只要寥寥几条请求~够高大上么  

###如何模拟ajax数据

我们上面的列表数据是js里写死的，所以用不到ajax数据模拟。接下来开始：  

我们回到第5步中创建的app/scripts/controllers/list.js，把那个数组改成ajax方式获取，这里需要引入$http服务：   
  

```javascript
angular.module('bookstoreApp')
    .controller('ListCtrl', function ($scope,$http) {
        $http.get('books.json?_method=GET').success(function (data) {
            $scope.books = data;
        })

    });
```

在mock目录下新建book目录，在book下新建books#GET.json,内容为：  

```javascript
[
    {
        "id":1,
        "name":"用AngularJS开发下一代web应用",
        "author":"大漠穷秋",
        "price":1.20
    },
    {
        "id":2,
        "name":"浪潮之巅",
        "author":"吴军",
        "price":1.21
    },
    {
        "id":3,
        "name":"macTalk",
        "author":"池建强",
        "price":1.22
    }
]
```
重新启动服务：  

```
grunt serve
```

访问list页面，发现跟之前的写死数据效果一样。  
再看看控制台，打印出了刚才的json数据，如果这个时候，你修改json文件里的某条数据，保存后，浏览器也会立即刷新，是不是很贴心？  

再讲一下这里的ajax数据模拟规则：  

之前做到这个功能的时候，本来再弄一个ajax地址与json文件目录的配置文件，想起玉伯曾经说的 *约定大于配置* 原则。还真是有道理，多一个配置文件，岂不是又增加了工作负担？于是我就搞了这么个约定：  

现在RESTful请求大行其道，我们也不能落下，我列出一个映射表，相信效果会比啰嗦的文字效果好：  

左边是ajax地址，右边是对应的模拟数据json路径  

/books.json?_method=GET       ==> mock/book/books#GET.json //获取列表  
  
/books.json?_method=POST      ==> mock/book/books#POST.json //新增数据  
 
/books/12.json?_method=GET    ==> mock/book/books.N.json#POST.json //查看id为12的数据

/books/25.json?_method=GET    ==> mock/book/books.N.json#POST.json //查看id为25的数据，这2种情况返回相同的json，因为毕竟不是真正的查询数据库，所以搞了个N来代替数字  

/books/55.json?_method=PATCH  ==> mock/book/books.N#PATCH.json //修改id为55的数据  

/books/77.json?_method=DELETE ==> mock/book/books.N#DELETE.json //删除id为77的数据

怎么样，是不是有点数了？你可能还有个疑问，为什么多出了一个book目录？  
这又是一个约定，当工程业务域多了以后，每个目录下最好还是以业务域分类的好，我这里暴力的约定，业务名不带s，ajax地址要加上s，views，mock等需要按业务域分类的目录，不加s，所以这里多了个book目录~  

你可能又要问，英语里，有些单词不是以es，ies结尾的吗，比如s和x结尾，还有某些更特殊的呢。。。

所以呢，我建议业务域取名字，就要避开那些特殊的单词了嘛~~~



====
以上是本工具的基本使用方法，下面讲一讲稍高级的用法  














##与官方版generator-angular的对比

这里讲一下两者的关键区别，简要起见，我们约定：  
*A*=generator-angular生成的工程  
*B*=generator-ngstone生成的工程  
1. A的index.html的bower组件与我们自己模块的引用路径都是顶级路径，比如angular.js的引用路径：

```html
<script src="bower_components/angular/angular.js"></script>
```

而实际上，index.html与bower_components不在同一层目录！
用grunt启动服务，的确没有问题，可以加载到bower组件，因为gruntfile中的connect任务有相应配置  
而我们有自己的后端，当我们部署工程的时候，bower组件就加载不到了！还要用nginx额外配置一下才能加载到，这样很不方便。  
于是在B中，我把路径前变成了相对路径，即：  

```
<script src="../bower_components/angular/angular.js"></script>
```
这样，到了部署的时候也不会有问题了，省去nginx额外的配置。  
2. 大大