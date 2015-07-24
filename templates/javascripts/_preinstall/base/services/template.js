'use strict';
/**
 * @ngdoc service
 * @name ngCustomBase.template
 * @description 为了使打包进js的模板，也能被获取，抽象出此服务
 * # template
 * Factory in the ngCustomBase.
 */
angular.module('ngCustomBase')
    .factory('templateService', function ($http, $templateCache) {
        return {
            get: function (templateUrl) {
                return $http.get(templateUrl, {cache: $templateCache});
            }
        };
    });