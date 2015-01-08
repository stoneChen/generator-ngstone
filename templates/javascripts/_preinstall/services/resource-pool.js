'use strict';

/**
 * @ngdoc service
 * @name <%= scriptAppName %>.resources
 * @description
 * # resources 资源池
 * Factory in the <%= scriptAppName %>.
 */
angular.module('<%= scriptAppName %>')
    .factory('resourcePool', function (resourceService) {
        var rc = resourceService.create;
        return {
            session: rc('/session')
        }
    });
