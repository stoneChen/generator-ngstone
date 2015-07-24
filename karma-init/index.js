'use strict';
var yeoman = require('yeoman-generator');
var path = require('path');
var chalk = require('chalk');

module.exports = yeoman.generators.Base.extend({
    initializing: function () {
        var enabledComponents = [
            'jquery/dist/jquery.js',
            'hammerjs/hammer.js',
            'angular/angular.js',
            'angular-route/angular-route.js',
            'angular-animate/angular-animate.js',
            'angular-sanitize/angular-sanitize.js',
            'ryanmullins-angular-hammer/angular.hammer.js',
            'angular-local-storage/dist/angular-local-storage.js',
            'angular-mocks/angular-mocks.js'
        ];
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
