'use strict';
var yeoman = require('yeoman-generator');
var path = require('path');
var chalk = require('chalk');
var SubGeneratorBase = require('../subgenerator-base');

module.exports = SubGeneratorBase.extend({
    writing: function () {
        this.generateHtmlFile(this.name)
    }
});
