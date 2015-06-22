'use strict';
var yeoman = require('yeoman-generator');
var path = require('path');
var chalk = require('chalk');
var generatorUtil = require('./generator-util');

module.exports = yeoman.generators.NamedBase.extend({
    constructor: function () {
        yeoman.generators.NamedBase.apply(this, arguments);
        var generatorCfg = this.config.getAll();

        //bower config
        var bowerConfig = require(path.join(process.cwd(), 'bower.json'));
        this.appName = bowerConfig.name;
        this.scriptAppName = generatorUtil.addAppNameSuffix(this.appName);
        this.classedName = this._.classify(this.name);
        this.cameledName = this._.camelize(this.name);
        this.dashedName = this._.dasherize(this.name);
        this.appPath = bowerConfig.appPath;
    },
    generateSourceAndTest: function (templateName,dest,skipTestFile) {
        this.sourceRoot(path.join(__dirname, './templates/javascripts'));
        var sourceFileName = generatorUtil.addScriptSuffix(templateName);
        var targetFileName = generatorUtil.addScriptSuffix(this.dashedName);
        this.template(
            this.templatePath(sourceFileName),
            this.destinationPath(this.appPath,'scripts',dest,targetFileName)
        );
        generatorUtil.addScriptToIndex(this.appPath,path.join('scripts',dest, this.dashedName),this);
        //add test file
        if(!skipTestFile){
            if(templateName === 'factory'){
                sourceFileName = generatorUtil.addScriptSuffix('service');
            }
            this.template(
                this.templatePath('unit',sourceFileName),
                this.destinationPath('test/unit',dest,targetFileName)
            );
        }
    },
    generateHtmlFile: function (viewName,dest) {
        this.sourceRoot(path.join(__dirname, './templates/views'));
        dest = dest || path.join(this.appPath,'views',viewName,viewName + '.html');
        this.template(
            this.templatePath('view.html'),
            this.destinationPath(dest)//创建一层同名的目录，可以在这里创建其他视图，如dialog
        )
    }
});
