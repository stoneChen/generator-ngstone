'use strict';
/**
 * @ngdoc service
 * @name ngCustomBase.template
 * @description
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