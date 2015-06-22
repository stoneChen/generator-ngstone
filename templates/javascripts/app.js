'use strict';
/**
 * @ngdoc overview
 * @name <%= scriptAppName %>
 * @description
 * # <%= scriptAppName %>
 *
 * Main module of the application.
 */
angular
    .module('<%= scriptAppName %>', [
        'ngTouch',
        'ngAnimate',
        'ngRoute',
        'ngSanitize',
        'LocalStorageModule'
    ])
    .config(function ($routeProvider) {
        $routeProvider
            .otherwise({
                redirectTo: '/main'
            });
     })
    .config(function($compileProvider){
        //链接白名单
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/);
    })
;
