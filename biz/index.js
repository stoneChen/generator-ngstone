'use strict';
var yeoman = require('yeoman-generator');
var path = require('path');
var chalk = require('chalk');
var generatorUtil = require('../generator-util');
var SubGeneratorBase = require('../subgenerator-base');

module.exports = SubGeneratorBase.extend({
    writing: function () {

        var jsonPath = path.join(this.destinationPath(),'biz',(this.name + '.json'));
        if(!this.fs.exists(jsonPath)){
            this.log.error(chalk.red(jsonPath + ' 不存在！'));
            return;
        }
        this.bizCfg = this.fs.readJSON(jsonPath);
        this.sourceRoot(path.join(__dirname, '../templates/views/biz'));
        this.template(
            path.join(this.bizCfg.type,'data-grid.html'),
            this.destinationPath('app/views',this.name,(this.name + '.html'))
        );
        this.sourceRoot(path.join(__dirname, '../templates/javascripts/biz'));
        this.template(
            path.join(this.bizCfg.type,generatorUtil.addScriptSuffix('controller')),
            this.destinationPath('app/scripts/controllers',generatorUtil.addScriptSuffix(this.name))
        );
        this._rewriteResourcePool();
        this.on('end', function () {//如果直接用invoke，会出现三次overwrite的提示，未查出原因
            this.invoke('ngstone:route',{
                args:[this.name,'--biz']
            });
        })
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
                "," + this.name + ": create('" + resourceCfg.urlPattern + "')"
            ]
        };
        generatorUtil.rewriteFile(config);
    }
});
