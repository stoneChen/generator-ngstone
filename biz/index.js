'use strict';
var yeoman = require('yeoman-generator');
var path = require('path');
var chalk = require('chalk');
var generatorUtil = require('../generator-util');
var SubGeneratorBase = require('../subgenerator-base');

module.exports = SubGeneratorBase.extend({
    writing: function () {
        if(generatorUtil.isBadBusinessName(this.name)){
            this.log.error(chalk.red('请使用非数字且最后一位不包含s、x的名称！'));
            return;
        }
        var jsonPath = path.join(this.destinationPath(),'biz',(this.name + '.json'));
        if(!this.fs.exists(jsonPath)){
            this.log.error(chalk.red(jsonPath + ' 不存在！'));
            this.log('请执行 ' + chalk.yellow('yo ngstone:biz-cfg ' + this.name) + ' 初始化json配置文件');
            return;
        }
        this.bizCfg = this.fs.readJSON(jsonPath);
        this._addView();
        this._addController();
        this._rewriteResourcePool();
        this._addMocks();
        this.on('end', function () {//如果直接用invoke，会出现三次overwrite的提示，未查出原因
            this.invoke('ngstone:route',{
                args:[this.name,'--biz']
            });
        })
    },
    _addView: function () {
        this.sourceRoot(path.join(__dirname, '../templates/views/biz'));
        this.template(
            path.join(this.bizCfg.type,'data-grid.html'),
            this.destinationPath('app/views',this.name,(this.name + '.html'))
        );
        this.template(
            path.join(this.bizCfg.type,'dialog-form.html'),
            this.destinationPath('app/views',this.name,'dialog-form.html')
        );
    },
    _addController: function () {
        this.sourceRoot(path.join(__dirname, '../templates/javascripts/biz'));
        this.template(
            path.join(this.bizCfg.type,generatorUtil.addScriptSuffix('controller')),
            this.destinationPath('app/scripts/controllers',generatorUtil.addScriptSuffix(this.name))
        );
        generatorUtil.addScriptToIndex(this.appPath,'scripts/controllers/' + generatorUtil.addScriptSuffix(this.name),this);
    },
    _rewriteResourcePool:function () {
        var resourceCfg = this.bizCfg.resource;
        var config = {
            file: path.join(
                this.appPath,
                'scripts/services/resource-pool.js'
            ),
            needle: '//do not delete this line',
            splicable: [
                "," + this.cameledName + ": create('" + resourceCfg.urlPattern + "')"
            ]
        };
        generatorUtil.rewriteFile(config);
    },
    _addMocks: function () {
        var self = this;
        var mocks = this.bizCfg.mock;
        var collectionReg = /^[a-z]+\/([a-z]+)#(GET)\.json$/;
        this.sourceRoot(path.join(__dirname, '../templates/mock'));
        mocks.forEach(function (fileName) {
            var mockFileCfg = self.mockFileCfg = {};//每次都替换
            mockFileCfg.fileName = fileName;
            mockFileCfg.mockCollection = collectionReg.test(fileName);
            self.template(
                'mock.json',
                self.destinationPath('mock',fileName)
            )
        })
    }
});
