'use strict';
/**
 * @ngdoc service
 * @name ngCustomBase.loading
 * @description 管理页面loading状态的显示
 * # loading
 * Factory in the ngCustomBase.
 */
angular.module('ngCustomBase')
    .config(function (rootDataServiceProvider) {
        rootDataServiceProvider.register('ROOT_loadingStatData');
    })
    .factory('loadingService', function (rootDataService) {
        var ROOT_loadingStatData = rootDataService.data('ROOT_loadingStatData')
        return {
            show: function (flag,loadingText) {
                flag = angular.isUndefined(flag) ? true : flag;
                //loadingText = loadingText || '请稍后...';
                ROOT_loadingStatData.set('show', flag);
                //ROOT_loadingStatData.set('loadingText', loadingText);
            }
        }
    });