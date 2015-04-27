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
    .module('<%= scriptAppName %>', [<% if(isMobileApp){ %>
        'ngTouch',<%} if(uiRouter){ %>
        'ui.router',<% } else{ %>
        'ngRoute',<% } %>
        'ngSanitize',
        'ui.bootstrap'<% if(baseServiceModules.bower['angular-local-storage']){ %>,
        'LocalStorageModule'<% } %>
    ])<% if(uiRouter){ %>
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/main');
        $stateProvider
            .state('mainland',{
                abstract:true,
                templateUrl:'./views/_common/mainland.html'
            })<% if(initBaseServiceAndLayout){ %>
            .state('login',{
                url:'/login',
                templateUrl:'./views/_common/login.html',
                controller:'LoginCtrl'
            })
            .state('mainland.user',{
                url:'/user',
                templateUrl:'./views/user/user.html',
                controller:'UserCtrl'
            })<% } %>
            //DO NOT delete this line,which is used to find the place to insert state config
    })<% } else { %>
    .config(function ($routeProvider) {
        $routeProvider<% if(initBaseServiceAndLayout){ %>
            .when('/user', {
                templateUrl: './views/user/user.html',
                controller: 'UserCtrl'
            })<% } %>
            .otherwise({
                redirectTo: '/main'
            });
     })<% } %>
    .config(function($compileProvider){
        //链接白名单
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/);
    })<% if(initBaseServiceAndLayout){ %>
    .run(function (sessionService, $rootScope) {
        sessionService.checkLogin();
        <% if(!uiRouter){ %>
        $rootScope.$on('$routeChangeSuccess', function (event, current) {
            //路由改变时的回调
        });<% } %>
    })<% } %>
;
