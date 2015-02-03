'use strict';
/**
 * @ngdoc function
 * @name <%= scriptAppName %>.mockfile
 * @description
 * # 用于单元测试模拟数据，特别是全局的数据模拟，比如登陆数据，不需要每个controller都写登陆的模拟数据
 * mockfile of the <%= scriptAppName %>
 */
angular.module('<%= scriptAppName %>')
    .value('someData', {
        someProperty:123
    });
