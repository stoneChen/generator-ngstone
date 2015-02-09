'use strict';
var yeoman = require('yeoman-generator');
var path = require('path');
var chalk = require('chalk');
var generatorUtil = require('../generator-util');
var SubGeneratorBase = require('../subgenerator-base');

module.exports = SubGeneratorBase.extend({
    writing: function () {
        if(!this.initBaseServiceAndLayout){
            this.log.error(chalk.red('此工程没有初始化基础服务，无法执行此命令。'));
            return;
        }
        this.sourceRoot(path.join(__dirname, '../templates/biz'));
        this.template(
            'biz.json',
            this.destinationPath('biz',(this.name + '.json'))
        )
    }
});
