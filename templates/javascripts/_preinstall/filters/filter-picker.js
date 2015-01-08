'use strict';

/**
 * @ngdoc filter
 * @name <%= scriptAppName %>.filter:<%= classedName %>
 * @function
 * 当过滤器名称不确定时，根据参数动态获取"过滤器的过滤器",进行值的转化
 * @description
 * # filterPicker
 * Filter in the <%= scriptAppName %>.
 */
angular.module('<%= scriptAppName %>')
    .filter('filterPicker', function ($filter) {
        return function (value, filterName) {
            return filterName ? $filter(filterName)(value) : value;
        };
    });
