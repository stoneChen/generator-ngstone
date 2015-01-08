'use strict';
var yeoman = require('yeoman-generator');
var path = require('path');
var chalk = require('chalk');
var yosay = require('yosay');
var generatorUtil = require('../generator-util');

module.exports = yeoman.generators.Base.extend({
    constructor: function () {
        yeoman.generators.Base.apply(this, arguments);
        //清空当前目录
//        generatorUtil.clearDir(process.cwd());
//        this.log('current dir:' + chalk.blue.bold(__dirname));
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
//        this._initModules();
        return;//暂时先不提示了
        var done = this.async();

        // Have Yeoman greet the user.
        this.log(yosay(
                'Welcome to the swell' + chalk.red('Angular-stone') + ' generator!'
        ));

        var prompts = [
            {
                type: 'confirm',
                name: 'bootstrap',
                message: 'Would you like to use bootstrap?',
                default: true
            }
        ];

        this.prompt(prompts, function (props) {
            props.bootstrap && this._pushModule('bootstrap');
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
        }
    },
    preinstall: function () {
        this.on('end', function () {//不用on end的话，执行addScriptToIndex会报index.html找不到
            this.sourceRoot(path.join(__dirname, '../templates/javascripts/_preinstall'));
            //scripts
            this._templateAndPreinstall('filters');
            this._templateAndPreinstall('services');
            this._templateAndPreinstall('directives');
            this._templateAndPreinstall('controllers');
            //views
            this.sourceRoot(path.join(__dirname, '../templates/views/_preinstall'));
            this.directory(
                'common',
                this.destinationPath('app/views/_common')
            );
            this.directory(
                'widgets',
                this.destinationPath('app/views/_widgets')
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
