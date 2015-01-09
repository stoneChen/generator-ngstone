'use strict';

/**
 * @ngdoc service
 * @name <%= scriptAppName %>.globalDataService
 * @description
 * # globalDataService 全局变量/数据管理服务
 * Factory in the <%= scriptAppName %>.
 */
angular.module('<%= scriptAppName %>')
    .factory('rootDataService', function ($rootScope) {
        var RootData = function () {
        };
        RootData.prototype = {
            get: function (name) {
                return this[name];
            },
            set: function (name, value) {
                this[name] = value;
                return this;
            }
        };
        var register = function (rootDataArr) {
            angular.forEach(rootDataArr, function (key) {
                $rootScope[key] = new RootData();
            })
        };
        register(['ROOT_loginData', 'ROOT_loadingStatData', 'ROOT_messageData']);//必须一次性添加，不可动态添加单个，这样可以很方便的在一共地方查看所有rootScope下的变量
        return {
            data: function (key) {
                return $rootScope[key];
            }
        }
    })
    .factory('globalDataService', function () {//这里存放初始化的全局数据，下面是一些demo
        var globalData = {
            upload: {
                url: '/upload',
                imgTypes: ['.jpg', '.jpeg', '.gif', '.bmp', '.png']
            },
            menu: [
                {"children": [
                    {"children": [],"href": "#/main", "name": "我的主页"},
                    {"children": [
                        {"children": [], "href": "#/myinfo/personal1", "name": "个人信息1"},
                        {"children": [], "href": "#/myinfo/personal2", "name": "个人信息2"}
                    ], "href": "", "name": "个人信息"}
                ], "name": "我的信息"},
                {"children": [
                    {"children": [], "href": "#/users", "name": "用户管理"},
                    {"children": [], "href": "#/submenu2", "name": "子菜单2"}
                ], "name": "demo菜单组"}
            ]
        };
        return {
            get: function (name) {
                return globalData[name];
            },
            set: function (name, value) {
                globalData[name] = value;
            }
        };
    })

;
