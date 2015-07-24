# generator-ngstone
used to build a **Mobile AngularJS** project scaffolding.

> [Yeoman](http://yeoman.io) generator

#正式迁移至移动端！！！

##说明
本工具[前身](https://github.com/stoneChen/generator-ngstone/tree/0.2.8-pc)为桌面版，现"华丽转身"为移动端专用，不过在初始化工程后，适当改动也可以适用于*高级桌面浏览器*。   
此大版本舍弃了0.x版本的各种选择，比如angular-route与ui-router，是否初始化基础服务等。增加了autoprefixer，雪碧图自动化等实用功能。  
angular及其插件版本升级至~1.4.0.   
增加移动端的一部分通用组件，如提示框、确认框，滑入式子页面等.  
响应式设计(准确的讲，是针对手持设备的响应式),采用【动态计算定宽(640px)与屏幕宽度的比，动态设置页面缩放比】来实现。  
特此将文档重新撰写，不涉及移动端特性的部分，文档内容基本保持不变。  
下面进入getting started.

###1.安装
在此之前请确保你安装了yo bower grunt-cli这三个*全局*模块，然后再安装本模块：  
````bash
npm install -g generator-ngstone
````

###2.初始化项目
新建一个目录，比如又叫bookstore(咦？我为什么要说"又"呢),cd 进去(本工具所有命令都是在此根目录下执行)，执行：  
````bash
yo ngstone
````
瞬间生成一坨文件，然后开始安装bower组件和node模块。  
初始化完成后，你会发现bookstore下，生成了很多目录与文件。  
简单介绍一下：  

```
app/ //项目的html，js，less，css都在这里    
mock/  //无后端开发时，需要模拟数据，所有的数据模拟文件都在这里  
test/  //所有的测试文件与配置都在这里  
bower_components/  //bower安装的组件都在这里  
node_modules/ //所有node模块都在这里 
bower.json //bower配置文件   
Gruntfile.js  //不解释了~   
package.json  //不解释了~  
README.md  //不解释了~    
```
工具将以你的根目录名称+App作为angular的app应用模块名称，所有后续的指令，服务等，都是基于此名称的模块建立的。那我们这里的app名称就是 `bookstoreApp` 。你可以打开app目录下的任意一个js查看。  

###3.执行雪碧图自动化任务
这一步是可选的。  
把你项目的所有背景图片复制到app/images目录下，然后执行：  
```bash
grunt sprite
```
将会生成app/styles/sprites.css与雪碧图，index.html已经默认引用了它，在后续开发中，调用相应的class即可引入背景。 
若有不希望自动合并入雪碧图的图片，可以在 grunt-task-params.js中配置，下文会讲到。  
若不执行此步骤，初始化文件中，已经有一个无代码的app/styles/sprites.css用于占位，不会404.  

###4.启动服务器
还是在bookstore的目录下：

```
grunt serve
```

这会调用grunt任务，很快就会调用你的默认浏览器，并打开 http://{{your IP}}:9000/ 这个网址。  
如果你看到页面上有一个bookstoreApp标题，那么恭喜你成功初始化了一个Angular项目！  
在以前的版本，在初始化工程时，就新建了一个叫做main的页面，为了跟之前的教程保持一致，这里执行一次：  
````bash
yo ngstone:route main
````
来新建一个main页面，就当剧透啦。
回到浏览器，刷新，就可以看到yeoman的LOGO。

###5.开发一个新页面
比如我们要开发一个图书list页面，执行：  
```
yo ngstone:route list
```

命令行最后几行提示：  

```
script added into index.html: scripts/controllers/list.js
   create         test/e2e/list/list.js
   create         app/scripts/controllers/list.js
   create         test/spec/controllers/list.js
   create         app/views/list/list.html
```
意思是，添加了引用controller的script标签到index.html，并创建了controller和测试文件，以及视图文件。  

然后，回到浏览器，把地址栏里的 http://{{your IP}}:9000/#/main 改为 http://{{your IP}}:9000/#/list 回车，
你会发现，最下面那句话，之前的main变成了list，也就是  

```
this is the list view. to be continued...  
```

list这个位置的单词是加大字号并加了蓝色的，加以明显的提示和区分。  

怎么样，创建一个新页面是不是很快？  
接下来我们要制作一个图书列表，首先将下面的代码，替换到  app/views/list/list.html 中：  

````html
<div class="page-list">
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
</div>

````


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
<body ng-app="bookstoreApp">
<!-- Add your site or application content here -->
    <div class="header">
        <h2 class="text-center">bookstoreApp</h2>
    </div>
    <ul class="nav">
        <li><a ng-href="#/main">Home</a></li>
        <li><a ng-href="#/list">List</a></li>
    </ul>
    ...
</body>
```
再回到浏览器，分别点击标题下的的Home或List，就可以在主页和list页之前切换了！（这个是Angular的路由功能，已经不是本工具应该讨论的范畴了，就不深入说明了- -）  

####使用hammerjs手势
本工具引入了ryanmullins-angular-hammer(hammerjs官网推荐)，它封装了hammerjs的所有手势指令。  
使用最多的手势非tap莫属了，我们尝试一下。  
在main.html里，为div.page-main根元素添加指令：  
````html
<div class="page-main" hm-tap="tap()">
...
</div>
````
在main.js里，添加：
````javascript
$scope.tap = function(){
    alert('hello angular!')
}
````
用手机访问应用，手指点击一下灰色区域，将会弹出hello angular！  
更多手势的使用，请访问 [AngularHammer](http://ryanmullins.github.io/angular-hammer/)  

这样，一个简单的页面就开发完了，awesome！  

###6.添加directive

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
讲完了ngstone:directive的两个选项，接下来让我们完成这个hello指令。假定我使用了外部模板，即，使用`--templateUrl` 这个选项创建指令，我们在link函数里写上：  

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

表明我们的directive添加成功了！

###7.添加factory，filter，decorator

添加它们的命令和directive类似，只不过没有那两个template选项，就不再演示了。。  

另外，provider，service，value，constant我就不额外添加命令了，因为和factory太相似了，而且我个人认为还是factory用的频度最高，而且也够用了。实在不行，生成factory后再稍微改一改，再者它们本质都属于service，问题不大~

还有，decorator特殊一点，它不生成测试文件。  

大家可以自行尝试添加。  

文档最后我会把所有可用的命令罗列出来。


###8.单元测试
单元测试需要用到*PhantomJS*，它是一个开源的虚拟浏览器，没有UI界面，其他行为和真正的浏览器一样，用于单元测试再适合不过。
由于PhantomJS在某些情况下(天朝干的，你懂的)安装较慢，0.1.1版本开始，将单元测试环境初始化从工程初始化中独立出来。  
你可以先尝试执行  

```bash
yo ngstone:karma-init
```  

这条命令会安装phantomjs、karma-jasmine、grunt-karma、karma-phantomjs-launcher等模块，如果你的机器能够顺利完成的话，可以跳过此段落。
如果安装不顺利，八成是卡在phantomjs的安装.可以尝试执行 `npm install -g phantomjs` 或者参考官网 http://phantomjs.org/download.html ，
另外，通过homebrew也可以安装 `brew install phantomjs`。安装好phantomjs后，再执行 `yo ngstone:karma-init` ,应该问题都不大了。
再啰嗦一句，phantomjs装好后，是全局的，以后再次使用它就不用再安装了。  



单元测试环境安装完毕后，打开test/spec/controllers/list.js，把最下面的it(...),改成：  

```javascript
it('should attach a list of books to the scope', function () {
        expect(scope.books.length).toBe(4);
    });
```

命令行执行：  

```
grunt test-unit
```

这里会启动*PhantomJS*，执行我们的代码。  
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
 
###9.执行e2e测试  
e2e是 *end-to-end* 的简称，"端到端测试" 或 "场景测试" ，说白了就是让代码模拟人工测试，具有非常大的意义，规模大了可节省很多人力成本。   
首先需要安装protractor，它是angular团队开发的专门用于e2e测试的node模块，并针对angularjs做了优化，它会调用webdriver执行我们的测试代码。
执行  
```bash
npm install -g protractor
```
protractor也是全局的，下次就不用装了~  
然后，需要下载webdriver。官方的下载地址是 http://chromedriver.storage.googleapis.com/index.html  ，不过是被墙的，我这里 https://github.com/stoneChen/generator-ngstone/tree/master/webdriver 准备了一个，一个mac版，一个win版，你可以根据需要选择。
下过来后，解压缩出来是一个文件，把它放到 /usr/local/lib/node_modules/protractor/selenium下(win用户请自行对号入座，selenium目录可能不存在，自己建一个)  

接下来我们造一个测试效果。  
打开app/views/list/list.html，  在最下面添加：  

```html
<input type="text" ng-model="newer" class="form-control"/>
<p>hello {{newer}}</p>
```

打开test/e2e/list/list.js，修改it(...)，最后整个文件内容变成：  

```javascript
'use strict';
describe('e2e test for page: list', function() {
    it('should do something', function() {
        browser.get('http://localhost:9000/#list');
        var newer = element(by.model('newer'));
        var newerBinding = element(by.binding('newer'));
        newer.sendKeys('new comer');
        expect(newerBinding.getText()).toEqual('hello new comer');

        newer.clear();
        newer.sendKeys('protractor');
        expect(newerBinding.getText()).toEqual('hello protractor');
    });
});
```

然后启动服务，执行：  

```bash
grunt serve
```
再打开一个命令行窗口，还是这个目录，执行：  

```bash
grunt test-e2e
```

接下来，就是见证奇迹的时刻了！  
我们可以看到，另一个chrome程序被打开了，自动打开我们指定的url地址（list页面），在最下方的输入框中输入了new comer，清空，再输入protractor，最后自动关闭了窗口。  
回到命令行界面，我们看到了类似如下的日志：  

```bash
Running "protractor_invoker:e2e" (protractor_invoker) task
Using ChromeDriver directly...
[launcher] Running 1 instances of WebDriver
.

Finished in 3.248 seconds
1 test, 2 assertions, 0 failures

[launcher] 0 instance(s) of WebDriver still running
[launcher] chrome #1 passed

Done, without errors.
```

表明我们执行了1个测试，2个断言，0个失败。  
你可以尝试修改测试的输入值，再次运行，就会看到相应的错误信息~是不是很好玩？更多测试代码的语法见 http://angular.github.io/protractor/#/api  我也正在学习中~  
顺便带一句，上面的protractor_invoker插件，是我第一次写的grunt插件，只是很简单的调用全局protractor，有问题请速速通知我奥~

###10.打包构建工程 

功能开发好后，需要对静态文件作一系列的加工，这样上线后可以为我们带来加快访问速度，提高性能，减少网络流量等好处。接下来我们开始构建：  

```
grunt build
```

这过程做了很多事，视图打包进js（本人添加），依赖注入替换，js、css合并压缩，图片名添加后缀（刷新缓存）等。  
需要说明一下，我把官网版的generator的gruntfile任务流，去掉了图片压缩。  
图片压缩用到的grunt任务模块很大，而且windows下会报错，无法构建，因此去掉了它，如果需要图片压缩，请自行添加任务流。  
其他还有一些配置，在官方版的基础上删删改改，现在是可以顺利完成构建任务的~  
至于构建任务流的具体过程，我就先不讲了，有兴趣的同学，可以仔细研究一下，或许我以后会补上来吧。  

控制台唰唰唰的输出一坨日志后，构建完成。你会发现根目录下多出了一个dist目录，里面的内容比之前的简单多了：

```
fonts/   //所有的字体文件，包括bootstrap和fontawesome的
images/  //所有的图片文件，文件名是添加过后缀的
scripts/  //所有的js，是合并压缩过后的，里面只有两个文件，一个是所有的bower组件代码，一个是我们自己写的代码
styles/  //所有的css，同上
index.html //工程首页，是htmlmin过的
```
如果你觉得构建后的js和css还是太多，你完全可以自己动手，修改构建配置，把它们继续合并~  

*上面那句话是以前的版本，后来我才发现【把vendor.js和scripts.js分开，与，把vendor.css和all.css分开】的好处是，在项目不停迭代过程中，vendor.js和vendor.css几乎是不太会变化的，而scripts.js与all.css是几乎每次都要变化的，其实是合理利用了浏览器缓存。*  

然后呢，执行：  

```
grunt serve:dist
```

就会以dist为webroot启动服务，同样调用你的默认浏览器打开地址：http://{{your IP}}:9002  效果是和不打包构建一样的，性能肯定是更高的！随着你的工程越来越大，性能提升会越来越明显。打开浏览器调试工具，查看请求列表，只要寥寥几条请求~够高大上么  

ps：  
index.html中带有build和endbuild字样的注释是不能删除的，它们是构建时，寻找被打包压缩文件列表的起止标记！！！

###如何模拟ajax数据

我们上面的列表数据是js里写死的，所以用不到ajax数据模拟。接下来开始：  

我们回到第5步中创建的app/scripts/controllers/list.js，把那个数组改成ajax方式获取，这里需要引入$http服务：   
  

```javascript
angular.module('bookstoreApp')
    .controller('ListCtrl', function ($scope,$http) {
        $http.get('/book?_method=GET').success(function (data) {
            $scope.books = data;
        })

    });
```

新建bookstore/mock/book/book#GET.json,内容为：  

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
再看看node控制台，打印出了刚才的json数据，如果这个时候，你修改json文件里的某条数据，保存后，浏览器也会立即刷新，是不是很贴心？  

再讲一下这里的ajax数据模拟规则：  

之前做到这个功能的时候，本来想再弄一个ajax地址与json文件目录的配置文件，想起玉伯曾经说的 *约定大于配置* 原则。还真是有道理，多一个配置文件，岂不是又增加了工作负担？于是我就搞了这么个约定：  

现在RESTful请求大行其道，我们也不能落下，我列出一个映射表，相信效果会比啰嗦的文字效果好：  

左边是ajax地址，右边是对应的模拟数据json路径  

/book.json?_method=GET       ==> mock/book/book#GET.json //获取列表  
  
/book.json?_method=POST      ==> mock/book/book#POST.json //新增数据  
 
/book/12.json?_method=GET    ==> mock/book/book.N.json#POST.json //查看id为12的数据

/book/25.json?_method=GET    ==> mock/book/book.N.json#POST.json //查看id为25的数据，这2种情况返回相同的json，因为毕竟不是真正的查询数据库，所以搞了个N来代替数字  

/book/55.json?_method=PATCH  ==> mock/book/book.N#PATCH.json //修改id为55的数据  

/book/77.json?_method=DELETE ==> mock/book/book.N#DELETE.json //删除id为77的数据

怎么样，是不是有点谱了？你可能还有个疑问，为什么多出了一个book目录？  
这又是一个约定，当工程业务域多了以后，每个目录下最好还是以业务域分类的好，所以这里多了个book目录~  

在之前的版本，对业务域名称上有些限制，不过每个项目的需求不同，而且也比较麻烦，决定还是取消掉。总的来讲，route名称，rest-ajax一级名称，mock目录名等均取消s后缀的限制。

服务器模拟ajax数据的逻辑代码在Gruntfile.js的mockMiddleware函数中，你也可以根据自己的需求做适当改进。


PPS：
以上例子直接使用了$http服务，但在实际开发中，通常使用resourceService这个服务，它以RESTful方式封装了ajax接口，使用起来更加便捷，还是上面这个例子，用resource的方式，这么写就可以了：   
在app/scripts/services/resource-pool.js中，创建一个book资源对象:
```javascript
angular.module('bookstoreApp')
    .factory('resourcePool', function (resourceService) {
        var create = resourceService.create;
        return {
            _url:{//非资源级别的直接写url

            }
            ,book:create('/book')//创建book资源对象
            ,session: create('/member/session')
        }
    });
```  

在app/scripts/controllers/list.js中，获取这个资源对象,并调用query方法：  

```javascript
angular.module('bookstoreApp')
    .controller('ListCtrl', function ($scope,resourcePool) {
        var BookRC = resourcePool.book;
        BookRC.query({},function (resources) {
            $scope.books = resources;
        })
    });
```  

为了使业务处理更加灵活与统一，对后端返回的数据也有一定的要求，把刚刚的bookstore/mock/book/book#GET.json数据调整为：   
 
```javascript
{
  "stat":"OK",
  "data":{
    "collection":[
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
  }
}
```  

回到浏览器，发现一样可以渲染出刚刚的列表。优势不仅仅是这样，resource底层将列表中的每一条数据封装成了resource对象，获取其中的任一条数据，即可调用内置的删、改等方法，增、查需要通过资源类实现。    
而resourcePool统一管理所有的资源类，这样在controller里不需要关注具体的ajax地址是什么，只需要关注数据！  
总之，resourceService是为简化数据的CURD而生的！  
详见app/scripts/base/services/resource.js源码  

====  

以上是本工具的基本使用方法，下面讲一讲稍高级的用法  

====

##命令列表  

1. yo ngstone      初始化工程
2. yo ngstone:directive  {name}    生成directive，插入script标签到index.html,生成测试文件
3. yo ngstone:factory    {name}    生成factory，插入script标签到index.html,生成测试文件
4. yo ngstone:filter     {name}    生成filter，插入script标签到index.html,生成测试文件
5. yo ngstone:decorator  {name}    生成decorator，插入script标签到index.html
6. yo ngstone:controller {name}    生成controller，插入script标签到index.html,生成测试文件
7. yo ngstone:view       {name}    生成视图文件
8. yo ngstone:route      {name}    向app/scripts/app.js中添加路由配置,调用ngstone:controller和ngstone:view
9. yo ngstone:karma-init          初始化单元测试环境

##base服务中的关键模块说明

1. xhrService服务封装了ajax请求，如果用了resourceService服务，一般不需要直接调用此ajax服务  
2. resourceService服务用法大致与官方的resource一致，资源默认方法稍有不同，资源url中的参数格式使用 `{xxx}` 代替 `：xxx` ，资源实例添加了若干方法，去除action方法调用后的返回值（现在是undefined），个人认为这样会简单一些  
3. resourcePool，即资源池，用于存放所有的资源对象  
4. localStorageService服务是第三方的模块，用于实现本地数据持久化，初始化时用于存储菜单组折叠状态，你可以用于更多业务  
5. dialogService封装了确认框、与子页面组件  
6. rootDataService封装了$rootScope下自定义对象的存取，以防止管理混乱  

每个base中模块，都有注释，更多说明将持续补充。。。


###grunt-task-params.js配置
这是将被Gruntfile.js  require的参数模块，提供给某些grunt任务的额外参数配置
目前初始化工程后，直接支持：
1. 雪碧图的资源增量配置，主要用于排除某些不需要合并的图片，默认合并images目录下的所有图片(已排除images/_tmp/**/*.png,images/spritesheet.png，images/yeoman.png)
2. 配置需动态插入index.html的script，主要用于weinre调试脚本，静态假数据js等脚本的插入，而无需手动在index.html中删除，添加，删除，添加...  
3. 配置node静态http服务是否绑定IP，各有利弊，详见grunt-task-params.js注释

总之，已经开了个口子给你，更多功能，请自行扩展。

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
而我们有自己的后端，当我们部署工程的时候，bower组件就加载不到了！还要用nginx等前端反向代理额外配置一下才能加载到，这样很不方便。  
于是在B中，我把路径前变成了相对路径，即：  

```
<script src="../bower_components/angular/angular.js"></script>
```

这样，到了部署的时候也不会有问题了，省去nginx等的额外配置。  

2. A打包是不会将模板文件打包进js的，B会  

3. A的代码都是2个空格缩进，B的是4个空格缩进，个人比较喜欢4空格缩进  

4. A中启动服务(grunt serve)时，会根据bower.json里的配置，依次查找每个组件的bower配置main文件路径，往index.html中写入bower依赖的script或css引用标签，这本身是个很好的功能。但是，我遇到了两个问题。  
   比如bootstrap组件，在angular工程中，我只需要它的css，而不需要引用它的js（它不是基于angular指令的组件，而是传统的jquery插件，我使用angular-bootstrap代替它）。而每次启动服务，bootstrap的js总是会被引用进来，这造成了浪费。    
   再比如，ztree组件，我们通常需要的是jquery.ztree.all-3.5.js,而ztree中的bower配置的是jquery.ztree.core-3.5.js,这就造成引用不正确。  
   当然，我可以手动修改上述两个组件bower配置的main项，但是我觉得把bower组件提交到版本控制不太好，就像不把本地npm模块提交到版本控制。  
   所以呢，我就把这个 *本身很好却给我带来些许麻烦* 的功能给去掉了，感觉有点对不起yo团队囧。再所以呢，bower组件的依赖，需要手动写入到index.html。
5. A在初始化中安装单元测试环境，B在本版0.1.1把单元测试环境初始化从工程初始化独立出来，以加快初始化速度  
6. B增加了less自动化任务，包括watch与打包时都会自动编译成css
7. B增加了添加浏览器前缀的postcss处理
8. B在新建路由时，会新建与路由相对应的less由于是单页应用，所有的css都一次性加载，势必考虑到css命名空间的问题
9. B在common.less中增加了flex-box的基础class，直接调用相应class即可。
10. B增加了雪碧图的自动化处理
11. B增加了grunt额外参数配置，即上一节中的grunt-task-params.js
12. B增加了自动获取当前机器的IP，自动以此IP访问应用，好处是，结合chrome的插件二维码生成器，可以很快用手机扫二维码，访问应用
13. B增加了dialog，msg等常用组件。
14. B是针对移动端的，引入了hammerjs来处理手势事件
未完待续。。。 

##结语
本项目为本人 **个人** 第一个开源项目，欢迎大家支持，欢迎交流，共同进步~  
qq:597719186
