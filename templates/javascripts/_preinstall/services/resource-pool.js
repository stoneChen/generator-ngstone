'use strict';
/**
 * @ngdoc service
 * @name <%= scriptAppName %>.resourcePool
 * @description
 * # resourcePool
 * Factory in the <%= scriptAppName %>.
 */
angular.module('<%= scriptAppName %>')
    .factory('resourcePool', function (resourceService) {
        var create = resourceService.create;
        return {
            _url:{//非资源级别的直接写url

            }
            ,session: create('/member/session')
        }
    });