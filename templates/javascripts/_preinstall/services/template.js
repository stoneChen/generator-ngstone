'use strict';

/**
 * @ngdoc service
 * @name <%= scriptAppName %>.templateService
 * @description
 * # templateService 提供一个获取模板的简便方式
 * Factory in the <%= scriptAppName %>.
 */
angular.module('<%= scriptAppName %>')
    .factory('templateService', function ($http, $templateCache) {
        return {
            get: function (templateUrl) {
                return $http.get(templateUrl, {cache: $templateCache});
            }
        };
    });
