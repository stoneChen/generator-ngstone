'use strict';

/**
 * @ngdoc directive
 * @name circleApp.directive:modalWindow
 * @description 对modalWindow指令做扩展
 * # modalWindow
 */
angular.module('<%= scriptAppName %>')
    .directive('modalWindow', function ($compile,$modalStack) {
        return {
            restrict: 'EA',
            link: function postLink(scope, element, attrs) {
                //为了使modal居中
                element.append('<span class="vertical-alignment-helper"></span>');
                //统一添加close按钮
                var J_closeBtn = $compile('<button type="button" class="close" ng-click="closeBtnCancel()">×</button>')(scope);
                element.find('.modal-content').prepend(J_closeBtn);
                scope.closeBtnCancel = function () {
                    $modalStack.getTop().key.dismiss('cancel');
                }
            }
        };
    });