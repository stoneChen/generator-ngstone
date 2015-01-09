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
        'ngAnimate',
        'ngRoute',
        'ngSanitize',
        'ui.bootstrap'<% if(baseServiceModules.bower['angular-local-storage']){ %>,
        'LocalStorageModule'<% } %>
    ])
    .config(function ($routeProvider) {
        $routeProvider<% if(initBaseServiceAndLayout){ %>
            .when('/users', {
                templateUrl: './views/user/user.html',
                controller: 'UserCtrl'
            })<% } %>
            .otherwise({
                redirectTo: '/main'
            });
    })
    .config(function($compileProvider){
        //链接白名单
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/);
    })
    .run(function (sessionService, $rootScope, $modalStack) {
        sessionService.checkLogin();
        $rootScope.$on('$routeChangeSuccess', function (event, current) {
            //路由改变时的回调
        });
    })
;
