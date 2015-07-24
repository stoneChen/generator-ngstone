'use strict';
var yeoman = require('yeoman-generator');
var path = require('path');
var chalk = require('chalk');
var SubGeneratorBase = require('../subgenerator-base');
var generatorUtil = require('../generator-util');

module.exports = SubGeneratorBase.extend({
    writing: function () {
        this._rewriteAppJs();
        this._generateE2ETest();
        this._addLessFile();
        this.invoke('ngstone:controller',{
            args:[this.name]
        });
        this.invoke('ngstone:view',{
            args:[this.name,'--route']
        })
    },
    _addLessFile: function () {
        this.sourceRoot(path.join(__dirname, '../templates/styles'));
        this.template(
            this.templatePath('page.less'),
            this.destinationPath(path.join(this.appPath,'styles',this.dashedName + '.less'))
        );
        generatorUtil.importLess(this.appPath,this.dashedName,this);
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
    },
    _generateE2ETest: function () {
        this.sourceRoot(path.join(__dirname, '../templates/javascripts'));
        this.template(
            this.templatePath('e2e/spec.js'),
            this.destinationPath(path.join('test/e2e',this.name,generatorUtil.addScriptSuffix(this.name)))
        )
    }
});
