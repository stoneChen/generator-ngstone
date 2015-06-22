'use strict';
/**
 * @ngdoc service
 * @name <%= scriptAppName %>.loading
 * @description
 * # loading
 * Factory in the <%= scriptAppName %>.
 */
angular.module('<%= scriptAppName %>')
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