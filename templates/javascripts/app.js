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
        'ngRoute',
        'ngAnimate',
        'ngSanitize',
        'ngCustomBase',
        'hmTouchEvents',
        'LocalStorageModule'
    ])
    .config(function ($routeProvider) {
        $routeProvider
            .otherwise({
                redirectTo: '/main'
            });
     })
    .config(function($compileProvider){//链接白名单
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/);
    })
    .config(function (rootDataServiceProvider) {//注册$rootScope全局对象，传入key的数组
        //rootDataServiceProvider.register(['ROOT_xxxxData'])
    })
;
