'use strict';
var yeoman = require('yeoman-generator');
var path = require('path');
var chalk = require('chalk');

module.exports = yeoman.generators.Base.extend({
    initializing: function () {
        var generatorCfg = this.config.getAll();
        var mod_ngTouch = 'angular-touch/angular-touch.js';
        var mod_ngRoute = 'angular-route/angular-route.js';
        var mod_UIRouter = 'angular-ui-router/angular-ui-router.js';
        var mod_LocalStorage = 'angular-local-storage/dist/angular-local-storage.js';
        var enabledComponents = [
            'angular/angular.js',
            'angular-mocks/angular-mocks.js',
            'angular-sanitize/angular-sanitize.js',
            'angular-bootstrap/ui-bootstrap-tpls.js'
        ];
        if(generatorCfg.initBaseServiceAndLayout){
            enabledComponents.push(mod_LocalStorage);
        }
        if(generatorCfg.isMobileApp){
            enabledComponents.splice(2,0,mod_ngTouch);
        }
        if(generatorCfg.uiRouter){
            enabledComponents.splice(2,0,mod_UIRouter);
        }else{
            enabledComponents.splice(2,0,mod_ngRoute);
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
