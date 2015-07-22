'use strict';
/**
 * @ngdoc directive
 * @name ngCustomBase.directive:dialogConfirm
 * @description
 * # dialogConfirm
 */
angular.module('ngCustomBase')
    .directive('dialogConfirm', function () {
        return {
            restrict:'E',
            replace:true,
            templateUrl:'./views/_widgets/dialog-confirm/dialog-confirm.html',
            scope:{
                content:'@',
                action:'&'
            },
            link: function ($scope,$element,attrs) {
                var closeConfirm = function () {
                    $element.remove();
                    $scope.$destroy();
                };
                var action = $scope.action();
                $scope.ok = function () {
                    var ret = action();
                    //if(angular.isFunction(ret)){
                    //    ret();
                    //}
                    closeConfirm();
                };
                $scope.cancel = closeConfirm;
            }
        }
    });
