'use strict';

/**
 * @ngdoc function
 * @name <%= scriptAppName %>.controller:MenuCtrl
 * @description
 * # MenuCtrl
 * Controller of the circleApp
 */
angular.module('<%= scriptAppName %>')
    .controller('SideMenuCtrl', function ($scope, $location, $window, localStorageService, resourcePool,globalDataService) {
        $scope.menus = globalDataService.get('menu');
        //从本地存储读取菜单折叠状态
        var store_menuOpened = localStorageService.get('menuItemOpened');
        $scope.menuOpened = store_menuOpened || new Array($scope.menus.length);
        //ajax获取菜单方式
//        resourcePool.menu.query(function (resources) {
//            $scope.menus = resources;
//            var store_menuOpened = localStorageService.get('menuItemOpened');
//            $scope.menuOpened = store_menuOpened || new Array($scope.menus.length);
//        });

        $scope.isActive = function (item, parentItem) {
            var ret = (item.href === '#' + $location.path());
            if (!$scope.isActive.done && ret) {//只执行一次
                parentItem ? (parentItem.isExpand = true) : item.isExpand = true;
                $scope.isActive.done = true;
            }
            return ret;
        };
        $scope.menuHeadClick = function (index) {
            $scope.menus.forEach(function (menu,idx) {
                $scope.menuOpened[idx] = (index === idx ? !$scope.menuOpened[idx] : false);
            })
        }
        //关闭页面时，记录菜单折叠状态
        angular.element($window).on("beforeunload", function () {
            localStorageService.set('menuItemOpened', $scope.menuOpened);
        });
    });
