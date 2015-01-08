'use strict';

/**
 * @ngdoc service
 * @name <%= scriptAppName %>.sessionService
 * @description
 * # sessionService 登陆管理服务，登陆模块是一个特殊模块，从登陆模块中提取出公用的一部分API出来，方便全局调用
 * Factory in the <%= scriptAppName %>.
 */
angular.module('<%= scriptAppName %>')
    .factory('sessionService', function (rootDataService, resourcePool) {
        var SessionResource = resourcePool.session;
        var ROOT_loginData = rootDataService.data('ROOT_loginData');

        var sessionAPI = {
            checkLogin: function () {
                SessionResource.get(function (resource) {
                    ROOT_loginData.set('isLogin', resource.isLogin);
                    ROOT_loginData.set('loginUser', resource.loginUser || {});
                })
            },
            setLoginStatus: function (flag,loginUser) {
                ROOT_loginData.set('isLogin', flag);
                ROOT_loginData.set('loginUser', loginUser || {});
            },
            logout: function () {
                SessionResource.delete(function () {
                    ROOT_loginData.set('isLogin', false)
                    ROOT_loginData.set('loginUser', {});
                })
            },
            setLoginUser: function (user) {
                ROOT_loginData.set('loginUser', user);
            }
        };
        ROOT_loginData.set('logout', sessionAPI.logout);
        return sessionAPI;
    });
