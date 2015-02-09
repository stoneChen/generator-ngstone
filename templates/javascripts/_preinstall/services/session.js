'use strict';

/**
 * @ngdoc service
 * @name <%= scriptAppName %>.sessionService
 * @description
 * # sessionService 登陆管理服务，登陆模块是一个特殊模块，从登陆模块中提取出公用的一部分API出来，方便全局调用
 * Factory in the <%= scriptAppName %>.
 */
angular.module('<%= scriptAppName %>')
    .factory('sessionService', function (rootDataService, resourcePool <% if(uiRouter) {%>, $rootScope, $state<% } %>) {
        var SessionResource = resourcePool.session;
        var ROOT_loginData = rootDataService.data('ROOT_loginData');
        <% if(uiRouter){ %>
        rootDataService.addWatcher('ROOT_loginData.isLogin', function (isLogin) {
            if(isLogin === false){ //必须三个等号，第一次传进来是undefined
                $state.go('login')
            }else if(isLogin === true){
                $state.go('mainland.main');
            }
        });

        $rootScope.$on('$stateChangeStart',function(evt, toState, toParams, fromState, fromParams) {
            if(toState.name !== 'login' && !ROOT_loginData.get('isLogin')){//拦截未登录的跳转
                evt.preventDefault();
                $state.go('login')
            }
        });<% } %>
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
