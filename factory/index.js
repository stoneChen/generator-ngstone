'use strict';
var yeoman = require('yeoman-generator');
var path = require('path');
var chalk = require('chalk');
var SubGeneratorBase = require('../sub-gen-base');

module.exports = SubGeneratorBase.extend({
    writing: function () {
        this.generateSourceAndTest(
            'factory',
            'scripts/services'
        )
    }
});
