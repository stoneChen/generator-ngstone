'use strict';
var yeoman = require('yeoman-generator');
var path = require('path');
var chalk = require('chalk');
var yosay = require('yosay');
var generatorUtil = require('../gen-util');

module.exports = yeoman.generators.Base.extend({
    constructor: function () {
        yeoman.generators.Base.apply(this, arguments);
        //清空当前目录
        generatorUtil.clearDir(process.cwd());
//        this.log('current dir:' + chalk.blue.bold(__dirname));
        this.pkg = require('../package.json');
        this.argument('appName', {
            type: String,
            required: false,
            defaults:path.basename(process.cwd())//hookFor执行以后，this.args会清空，不知为何。。。只能这样写
        });
        this.appName = this._.camelize(this.appName);
        this.scriptAppName = generatorUtil.addAppNameSuffix(this.appName);

        this.hookFor('ngstone:route',{
            args:['main']
        });
    },

    prompting: function () {
        this._initModules();
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
    _initModules: function () {
        this.appModules = ['bootstrap','fontawesome','jquery','angular','angular-route','angular-sanitize','angular-animate','angular-bootstrap'];
    },
    _pushModule: function (m) {
        this.appModules.push(m);
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
                this.templatePath('app/index.html'),
                this.destinationPath('app/index.html')
            );
            this.bulkDirectory(
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
            this.bulkDirectory(
                'styles',
                this.destinationPath('app/styles')
            );
        },
        views: function () {
            this.sourceRoot(path.join(__dirname, '../templates'));
            this.bulkDirectory(
                'views/_common',
                this.destinationPath('app/views/_common')
            );
            this.bulkDirectory(
                'views/_widgets',
                this.destinationPath('app/views/_widgets')
            );
        }
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
