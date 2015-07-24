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
        this.preinstallScripts = [];
    },

    prompting: function () {
        var done = this.async();
        // Have Yeoman greet the user.
        this.log(yosay(
                'Welcome to the swell ' + chalk.red('Angular-stone') + ' generator!'
        ));
        var isCwdEmpty = generatorUtil.isDirEmpty(process.cwd());
        var prompts = [
            {
                type: 'confirm',
                name: 'needEmptyCwd',
                message: '当前目录非空，是否清空(bower_components与node_modules将跳过)?\n',
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
            done();
        }.bind(this));
    },
    writing: {
        common: function () {
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
                this.templatePath('grunt-task-params.js'),
                this.destinationPath('grunt-task-params.js')
            );
            this.template(
                this.templatePath('sprite.css.handlebars'),
                this.destinationPath('sprite.css.handlebars')
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
            this.template(
                this.templatePath('unit-mock/mock.js'),
                this.destinationPath('test/unit-mock/mock.js')
            );
            this.template(
                this.templatePath('e2e/protractor.conf.js'),
                this.destinationPath('test/protractor.conf.js')
            );
        },
        styles: function () {
            this.sourceRoot(path.join(__dirname, '../templates/styles'));
            var sourceDir = 'simple';
            this.directory(
                sourceDir,
                this.destinationPath('app/styles')
            );
        },
        preinstall: function () {
            this.sourceRoot(path.join(__dirname, '../templates/javascripts/_preinstall'));
            //scripts
            //this._templateAndPreinstall('filters');
            //this.preinstallScripts.push(path.join('scripts',subDir,f));
            //this._templateAndPreinstall('base/directives');
            //this._templateAndPreinstall('base/services');
            //this._templateAndPreinstall('services');
            this._templateAndPreinstall('base');
            this.preinstallScripts.push(path.join('scripts','app.js'));//放在ngCustomBase后
            this._templateAndPreinstall('services');
            //views
            this.sourceRoot(path.join(__dirname, '../templates/views'));
            this.directory(
                '_preinstall',
                this.destinationPath('app/views')
            );
        }
    },
    _templateAndPreinstall: function (subDir) {
        generatorUtil.readFiles(path.join(this.sourceRoot(),subDir), function (f,fullPath) {
            var paths = fullPath.split('_preinstall/');//无奈初次下策
            var relativePath = paths[1];
            var destPath = path.join('app/scripts',relativePath);
            this.template(fullPath,this.destinationPath(destPath));
            this.preinstallScripts.push(path.join('scripts',relativePath));
            //generatorUtil.addScriptToIndex(this.appPath,path.join('scripts',subDir,f),this);
        },this);
    },
    _addPreinstallScriptsToIndex: function () {//被迫的，如果靠前执行，会访问不到index.html囧
        this.preinstallScripts.forEach(function (script) {
            generatorUtil.addScriptToIndex(this.appPath,script,this);
        },this);
    },
    install: function () {
        this._addPreinstallScriptsToIndex();
        if(this.options['skip-install']){
            return;
        }
        var self = this;
        this.log(chalk.yellow('start to install bower dependencies:'));
        this.bowerInstall([],{},function () {
            self.log(chalk.yellow('start to install npm dependencies:'));
            self.npmInstall();
        });
    },
    end: function () {
        this.log(chalk.green('Initialization has been done. Have fun!'));
    }
})
