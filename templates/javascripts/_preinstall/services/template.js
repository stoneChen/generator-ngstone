'use strict';
/**
 * @ngdoc service
 * @name <%= scriptAppName %>.template
 * @description
 * # template
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