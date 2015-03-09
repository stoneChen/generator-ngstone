'use strict';
var yeoman = require('yeoman-generator');
var path = require('path');
var chalk = require('chalk');
var generatorUtil = require('../generator-util');
var SubGeneratorBase = require('../subgenerator-base');

module.exports = SubGeneratorBase.extend({
    writing: function () {
        this.directiveTemplateProperty = '';
        if(this.options['template']){
            this.directiveTemplateProperty = "\n            template:'<div></div>',"
        }else if(this.options['templateUrl']){
            var viewName = this.dashedName;
            var subPath = path.join('views/_widgets',viewName,viewName + '.html');
            var directiveTemplatePath = './' + subPath;
            this.directiveTemplateProperty = "\n            templateUrl:'" + generatorUtil.transformSlash(directiveTemplatePath) + "',";
            this.generateHtmlFile(viewName,path.join(this.appPath,subPath));
        }
        this.generateSourceAndTest(
            'directive',
            'directives'
        )
    }
});
