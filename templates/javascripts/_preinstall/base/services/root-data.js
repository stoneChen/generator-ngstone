'use strict';
/**
 * @ngdoc service
 * @name ngCustomBase.rootData
 * @description
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
        //register(['ROOT_loginData', 'ROOT_loadingStatData','ROOT_pageData']);//必须一次性添加，不可动态添加单个，这样可以很方便的在一共地方查看所有rootScope下的变量
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