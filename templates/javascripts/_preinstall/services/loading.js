'use strict';

/**
 * @ngdoc service
 * @name <%= scriptAppName %>.loadingService
 * @description
 * # loadingService 通讯提示服务
 * Factory in the <%= scriptAppName %>.
 */
angular.module('<%= scriptAppName %>')
    .factory('loadingService', function (rootDataService) {
        var ROOT_loadingStatData = rootDataService.data('ROOT_loadingStatData')
        return {
            show: function (flag) {
                flag = angular.isUndefined(flag) ? true : flag;
                ROOT_loadingStatData.set('showLoading', flag);
            }
        }
    });
