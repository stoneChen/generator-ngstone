'use strict';
/**
 * @ngdoc service
 * @name ngCustomBase.util
 * @description 各种工具方法
 * # util
 * Factory in the ngCustomBase.
 */
angular.module('ngCustomBase')
    .factory('utilService', function ($rootScope) {

        return {
            /*
             list = [{value:1,label:'A'},{value:2,label:'b'}]
             key = 'value'
             ==>{'1':{value:1,label:'A'},'2':{value:2,label:'b'}}
             */
            extractMapFromList: function (list,key) {
                key = key || 'value';
                var o = {};
                list.forEach(function (el) {
                    var k = el[key]
                    o[k] = el;
                })
                return o;
            },
            /*
            * 扩充第一个数组，把第二个元素，依次加入到第一个数组中
            * argument[0] = [1,2]
            * argument[1] = [4,5]
            * ==> [1,2,4,5]
            * */
            concatArrays: function (oriArr,toExtractArr) {
                toExtractArr.forEach(function (el) {
                    oriArr.push(el);
                })
            },
            safeApply: function (scope,fn) {
                if($rootScope.$$phase){
                    fn()
                }else{
                    scope.$apply(fn)
                }
            }
        };
    });