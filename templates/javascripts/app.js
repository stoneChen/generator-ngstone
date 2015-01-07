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
        'ui.bootstrap'
    ])
    .config(function ($routeProvider) {
        $routeProvider
            .otherwise({
                redirectTo: '/main'
            });
    });
