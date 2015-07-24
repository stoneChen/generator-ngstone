'use strict';
/**
 * @ngdoc service
 * @name ngCustomBase.rootData
 * @description 封装$rootScope下对象的存取
 * # rootData
 * Factory in the ngCustomBase.
 */
angular.module('ngCustomBase')
    .provider('rootDataService', function () {
        var rootKeys = [];
        var RootData = function () {};
        RootData.prototype = {
            get: function (name) {
                return this[name];
            },
            set: function (name, value) {
                this[name] = value;
                return this;
            }
        };
        this.register = function (keys) {//可重复注册
            keys = angular.isArray(keys) ? keys : [keys];
            rootKeys = rootKeys.concat(keys);
        };
        this.$get = ['$rootScope',function ($rootScope) {
            rootKeys.forEach(function (key) {
                $rootScope[key] = new RootData();
            });
            return {
                data: function (key) {
                    return $rootScope[key];
                },
                addWatcher: function (expression,watcher) {
                    $rootScope.$watch(expression,watcher)
                }
            }
        }]

    })
;