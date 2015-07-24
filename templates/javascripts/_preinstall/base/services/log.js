'use strict';
/**
 * @ngdoc service
 * @name ngCustomBase.log
 * @description 为了配合weinre的log功能，重新写了一个log服务
 * # log
 * Factory in the ngCustomBase.
 */
angular.module('ngCustomBase')
    .factory('logService', function () {
        var methods = ['log','warn','error'];//这三个api一般够用
        var api = {};
        methods.forEach(function (m) {
            api[m] = function () {
                var args = [].slice.call(arguments);
                //关键就在于不缓存console，weinre将会把全局console替换掉
                console[m].apply(console,args);
            }
        });
        return api;
    });