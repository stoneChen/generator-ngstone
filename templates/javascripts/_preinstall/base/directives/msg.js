'use strict';
/**
 * @ngdoc directive
 * @name ngCustomBase.directive:msg
 * @description 提示信息指令
 * # msg
 */
angular.module('ngCustomBase')
    .directive('msg', function ($timeout) {
        return {
            restrict:'E',
            replace:true,
            templateUrl:'./views/_widgets/msg/msg.html',
            scope:{
                msgData:'='
            },
            link: function ($scope,$element,attrs) {
                var timer = $timeout(destory,3000);
                $scope.close = function () {
                    $timeout.cancel(timer);
                    destory();
                };
                function destory(){
                    $scope.$destroy();
                    $element.fadeOut(200, function () {
                        $element.remove();
                    });
                }
            }
        }
    });
