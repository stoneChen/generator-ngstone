'use strict';
var yeoman = require('yeoman-generator');
var path = require('path');
var chalk = require('chalk');

module.exports = yeoman.generators.Base.extend({
    initializing: function () {
        var bowerConfig = require(path.join(process.cwd(), 'bower.json'));
        this.initBaseServiceAndLayout = bowerConfig.initBaseServiceAndLayout;
        var enabledComponents = [
            'angular/angular.js',
            'angular-mocks/angular-mocks.js',
            'angular-animate/angular-animate.js',
            'angular-route/angular-route.js',
            'angular-sanitize/angular-sanitize.js',
            'angular-bootstrap/ui-bootstrap-tpls.js',
            'angular-local-storage/dist/angular-local-storage.js'
        ];
        if(!this.initBaseServiceAndLayout){
            enabledComponents.pop();
        }
        this.invoke('karma:app', {
            options: {
//                'skip-install': this.options['skip-install'],
                'base-path': '../',
                'bower-components': enabledComponents.join(','),
                'app-files': 'app/scripts/**/*.js',
                'test-files': [
                    'test/unit-mock/**/*.js',
                    'test/unit/**/*.js'
                ].join(','),
                'bower-components-path': 'bower_components'
            }
        });
    }
});
