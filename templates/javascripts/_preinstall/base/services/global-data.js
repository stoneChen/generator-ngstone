'use strict';
/**
 * @ngdoc service
 * @name ngCustomBase.globalData
 * @description
 * # globalData
 * Factory in the ngCustomBase.
 */
angular.module('ngCustomBase')
    .factory('rootDataService', function ($rootScope) {
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
        var register = function (rootDataArr) {
            angular.forEach(rootDataArr, function (key) {
                $rootScope[key] = new RootData();
            })
        };
        register(['ROOT_loginData', 'ROOT_loadingStatData','ROOT_pageData']);//必须一次性添加，不可动态添加单个，这样可以很方便的在一共地方查看所有rootScope下的变量
        return {
            data: function (key) {
                return $rootScope[key];
            },
            addWatcher: function (expression,watcher) {
                $rootScope.$watch(expression,watcher)
            }
        }
    })
;