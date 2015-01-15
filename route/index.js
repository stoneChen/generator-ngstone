'use strict';
var yeoman = require('yeoman-generator');
var path = require('path');
var chalk = require('chalk');
var SubGeneratorBase = require('../subgenerator-base');
var generatorUtil = require('../generator-util');

module.exports = SubGeneratorBase.extend({
    writing: function () {
        if(generatorUtil.isBadBusinessName(this.name)){
            this.log.error(chalk.red('请使用非数字且最后一位不包含s、x的名称！'));
            return;
        }
        this._rewriteAppJs();
        if(!this.options['biz']){
            this.invoke('ngstone:controller',{
                args:[this.name]
            });
            this.invoke('ngstone:view',{
                args:[this.name,'--route']
            })
        }
    },
    _rewriteAppJs:function () {
        this.uri = this.name;
        if (this.options.uri) {
            this.uri = this.options.uri;
        }
        var config = {
            file: path.join(
                this.appPath,
                'scripts/app.js'
            ),
            needle: '.otherwise',
            splicable: [
                    ".when('/" + this.uri + "', {",
                    "    templateUrl: './views/" + (this.name + '/' + this.name) + ".html',",//path.join(this.name,this.name)在windows下斜杠是反的
                    "    controller: '" + this.classedName + "Ctrl'",
                "})"
            ]
        };
        generatorUtil.rewriteFile(config);
    }
});
