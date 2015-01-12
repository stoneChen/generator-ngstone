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
        this.sourceRoot(path.join(__dirname, '../templates/biz'));
        this.template(
            'biz.json',
            this.destinationPath('biz',(this.name + '.json'))
        )
    }
});
