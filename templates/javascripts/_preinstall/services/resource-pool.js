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
        var create = resourceService.create;//do not modify this line.it is used for generator
        return {
            session: create('/session')
            ,user: create('/user/{id}')
            //do not delete this line.it is used for generator to find this line
        }
    });
