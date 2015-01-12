'use strict';
var yeoman = require('yeoman-generator');
var path = require('path');
var chalk = require('chalk');
var yosay = require('yosay');
var generatorUtil = require('../generator-util');

module.exports = yeoman.generators.Base.extend({
    constructor: function () {
        yeoman.generators.Base.apply(this, arguments);

        this.pkg = require('../package.json');
        this.argument('appName', {
            type: String,
            required: false,
            defaults:path.basename(process.cwd())//hookFor执行以后，this.args会清空，不知为何。。。只能这样写
        });
        this.appName = this._.camelize(this.appName);
        this.scriptAppName = generatorUtil.addAppNameSuffix(this.appName);
        this.classedName = this._.classify(this.name);
        this.cameledName = this._.camelize(this.name);
        this.appPath = 'app';
        this.initBaseServiceAndLayout = true;
        this.baseServiceModules = {
            bower:{},
            npm:{}
        };
        this.hookFor('ngstone:route',{
            args:['main']
        });
    },

    prompting: function () {
        var done = this.async();
        // Have Yeoman greet the user.
        this.log(yosay(
                'Welcome to the swell' + chalk.red('Angular-stone') + ' generator!'
        ));
        var isCwdEmpty = generatorUtil.isDirEmpty(process.cwd());
//        if(!isCwdEmpty){
//            this.prompt(, function (props) {
//                if(props.needEmptyCwd){
//                    //清空当前目录
//                    generatorUtil.clearDir(process.cwd(),true);
//                }
//            }.bind(this));
//        }
//
        var prompts = [
            {
                type: 'confirm',
                name: 'needEmptyCwd',
                message: '当前目录非空，是否清空(bower_components与node_modules将跳过)?\n',
                default: true
            },
            {
                type: 'confirm',
                name: 'initBaseServiceAndLayout',
                message: '是否初始化基础服务与布局?',
                default: true
            }
        ];
        if(isCwdEmpty){
            prompts.splice(0,1);
        }
        this.prompt(prompts, function (props) {
            if(props.needEmptyCwd){
                //清空当前目录
                generatorUtil.clearDir(process.cwd(),true);
            }
            this.initBaseServiceAndLayout = props.initBaseServiceAndLayout;
            done();
        }.bind(this));
    },
//    _initModules: function () {
//        this.appModules = ['bootstrap','fontawesome','jquery','angular','angular-route','angular-sanitize','angular-animate','angular-bootstrap'];
//    },
    _pushModule: function (m) {
        this.appModules.push(m);
    },
    writing: {
        common: function () {
            if(this.initBaseServiceAndLayout){
                this.baseServiceModules.bower['angular-local-storage'] = true;
            }
            this.sourceRoot(path.join(__dirname, '../templates/common'));
            this.template(
                this.templatePath('_package.json'),
                this.destinationPath('package.json')
            );
            this.template(
                this.templatePath('_README.md'),
                this.destinationPath('README.md')
            );
            this.template(
                this.templatePath('_bower.json'),
                this.destinationPath('bower.json')
            );
            this.template(
                this.templatePath('_Gruntfile.js'),
                this.destinationPath('Gruntfile.js')
            );
            this.template(
                this.templatePath('app/index.html'),
                this.destinationPath('app/index.html')
            );
//            this.template(
//                this.templatePath('app/favicon.ico'),
//                this.destinationPath('app/favicon.ico')
//            );
            this.directory(
                'app/images',
                this.destinationPath('app/images')
            );
        },
        javascripts: function () {
            this.sourceRoot(path.join(__dirname, '../templates/javascripts'));
            this.template(
                this.templatePath('app.js'),
                this.destinationPath('app/scripts/app.js')
            );
        },
        styles: function () {
            this.sourceRoot(path.join(__dirname, '../templates'));
            this.directory(
                'styles',
                this.destinationPath('app/styles')
            );
        },
        mocks: function () {
            this.sourceRoot(path.join(__dirname, '../templates/mock'));
            this.directory(
                '_preinstall',
                this.destinationPath('mock')
            );
        },
        biz: function () {
            this.sourceRoot(path.join(__dirname, '../templates/biz'));
            this.directory(
                '_preinstall',
                this.destinationPath('biz')
            );
        }
    },
    preinstall: function () {
        if(!this.initBaseServiceAndLayout){
            return;
        }
        this.on('end', function () {//不用on end的话，执行addScriptToIndex会报index.html找不到
            this.sourceRoot(path.join(__dirname, '../templates/javascripts/_preinstall'));
            //scripts
            this._templateAndPreinstall('filters');
            this._templateAndPreinstall('services');
            this._templateAndPreinstall('directives');
            this._templateAndPreinstall('controllers');
            //views
            this.sourceRoot(path.join(__dirname, '../templates/views'));
            this.directory(
                '_preinstall',
                this.destinationPath('app/views')
            );
        });
    },
    _templateAndPreinstall: function (subDir) {
        generatorUtil.readFiles(path.join(this.sourceRoot(),subDir), function (f,fullPath) {
            var destPath = path.join('app/scripts',subDir,f);
            this.template(fullPath,this.destinationPath(destPath));
            generatorUtil.addScriptToIndex(this.appPath,path.join('scripts',subDir,f));
        },this);

    },
    install: function () {
        if(this.options['skip-install']){
            return;
        }
        var self = this;
        this.log(chalk.yellow('start to install bower dependencies:'));
        this.bowerInstall([],{},function () {
            self.log(chalk.yellow('start to install npm dependencies:'));
            self.npmInstall();
        });
    }
});
