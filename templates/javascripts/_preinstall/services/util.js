'use strict';

/**
 * @ngdoc service
 * @name <%= scriptAppName %>.utilService
 * @description
 * # utilService 所有的工具函数，在此管理
 * Factory in the <%= scriptAppName %>.
 */
angular.module('<%= scriptAppName %>')
    .factory('utilService', function () {
        var extend = angular.extend,
            isFunction = angular.isFunction;
        return {
            /*
             [{value:1,label:'A'},{value:2,label:'b'}]
             ==>{'1':'A','2':'B'}
             */
            extractMapData: function (arr, keyLeft, keyRight) {
                var o = {};
                keyLeft = keyLeft || 'value';
                keyRight = keyRight || 'label';
                angular.forEach(arr, function (el) {
                    var k = el[keyLeft];
                    o[k] = el[keyRight];
                });
                return o;
            },
            /*
             [{a:1,b:'A'},{a:2,b:'b'}]
             ==>[{value:1,label:'A'},{value:2,label:'b'}]
             */
            extractSelectList: function (arr, label, value) {
                var o = [];
                angular.forEach(arr, function (el) {
                    var k = {}
                    k.value = el[value];
                    k.label = el[label];
                    o.push(k);
                });
                return o;
            },
            /*
             [{value:1},{value:2}]
             ==>{'1':true,'2':true}
             */
            extractCheckBoxData: function (arr, keyLeft) {
                var o = {};
                keyLeft = keyLeft || 'value';
                angular.forEach(arr, function (el) {
                    var k = el[keyLeft];
                    o[k] = true;
                });
                return o;
            },
            /*
             {'1':true,'2':false}
             ==>[{value:1}]
             */
            extractCheckedData: function (map, keyLeft) {
                var o = [];
                keyLeft = keyLeft || 'value';
                angular.forEach(map, function (v, k) {
                    if (v) {
                        var temp = {};
                        temp[keyLeft] = k;
                        o.push(temp);
                    }
                });
                return o;
            },
            resultVal: function (val,context) {
                var args = [].slice.call(arguments,2);
                return isFunction(val) ? val.apply(context,args) : val;
            }
        };
    });
