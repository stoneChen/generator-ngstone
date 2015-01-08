'use strict';

/**
 * @ngdoc service
 * @name <%= scriptAppName %>.storeService
 * @description
 * # storeService 本地持久化服务，调用开源的一个模块
 * Factory in the <%= scriptAppName %>.
 */
angular.module('<%= scriptAppName %>')
    .config(function (localStorageServiceProvider) {
        localStorageServiceProvider
            .setPrefix('<%= scriptAppName %>');
    })
    .factory('storeService', function (localStorageService) {
        return {

        }
    });
