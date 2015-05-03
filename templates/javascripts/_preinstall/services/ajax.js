'use strict';

/**
 * @ngdoc service
 * @name <%= scriptAppName %>.ajaxService
 * @description
 * # ajaxService 封装http请求，开发业务时，只需关心成功结果，统一处理不正常的后台返回结果
 * Factory in the <%= scriptAppName %>.
 */
angular.module('<%= scriptAppName %>')
    .factory('ajaxService', function ($q, $http, $log, msgService, loadingService, rootDataService, $modalStack) {
        var REST = {
            'post': 'POST',
            'patch': 'PATCH',
            'get': 'GET',
            'del': 'DELETE',
            'put': 'PUT'
        };
        var ROOT_loginData = rootDataService.data('ROOT_loginData');
        return {
            request: $http,
            setRequest: function (customRequest) {
                this.request = customRequest;
            },
            send: function (options, hideLoading) {
                var self = this;
                loadingService.show(!hideLoading);
                // 调用的地方，只需要关心业务上的成功失败，http级别的error在这里统一处理，所以需要重新创建一个defer对象，而不能直接返回http的defer（这个defer只能触发http的失败）
                var deferred = $q.defer();

                if (options.ids) {
                    options.ids.forEach(function (id, index) {
                        options.url = options.url.replace('{' + index + '}', id);
                    });
                }

                var method = REST[options.method] || 'GET';
                options.url += '?_method=' + method;
                options.method = (method === 'GET' ? 'GET' : 'POST');
                if (options.method !== 'GET') {
                    options.headers = {
                        contentType: 'application/json; charset=utf-8'
                    }
                }
                self.request(options)
                    .success(function (res, status, headers, config) {
                        var stat = res.stat;
                        switch (stat) {
                            case 'OK':
                                deferred.resolve(res.data);
                                if(!res.silent && res.successMsg){
                                    msgService.success(res.successMsg);
                                }
                                break;
                            case 'LOGIN_TIMEOUT':
                                ROOT_loginData.set('isLogin', false);
                                $modalStack.dismissAll('cancel');//关闭所有弹窗
                                msgService.warn('登陆超时,请重新登陆');
                                deferred.reject(res);
                                break;
                            default:
                                if(!res.silent){
                                    var msg = (res.errors && res.errors.length && res.errors) || '系统异常：未知原因';
                                    msgService.error(msg);
                                    $log.error(msg);
                                }
                                deferred.reject(res);
                        }
                    })
                    .error(function (res, status, headers, config) {
                        $log.log('请求失败：' + res);
                        msgService.error('请求失败：' + res);
                        deferred.reject(res, status, headers, config);
                    })
                    .finally(function () {
                        loadingService.show(false);
                    });
                return deferred.promise;
            }
        }
    });
