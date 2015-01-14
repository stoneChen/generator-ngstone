'use strict';
var yeoman = require('yeoman-generator');
var path = require('path');
var chalk = require('chalk');
var SubGeneratorBase = require('../subgenerator-base');

module.exports = SubGeneratorBase.extend({
    writing: function () {
        this.directiveTemplateProperty = '';
        if(this.options['template']){
            this.directiveTemplateProperty = "\n            template:'<div></div>',"
        }else if(this.options['templateUrl']){
            var viewName = this.name;
            var subPath = path.join('views/widgets',viewName,viewName + '.html');
            var directiveTemplatePath = './' + subPath;
            this.directiveTemplateProperty = "\n            templateUrl:'" + directiveTemplatePath + "',";
            this.generateHtmlFile(viewName,path.join(this.appPath,subPath));
        }
        this.generateSourceAndTest(
            'directive',
            'directives'
        )
    }
});
