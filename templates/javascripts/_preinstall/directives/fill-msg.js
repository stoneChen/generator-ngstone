'use strict';
/**
 * @ngdoc directive
 * @name <%= scriptAppName %>.directive:fillMsg
 * @description
 * # fillMsg
 */
angular.module('<%= scriptAppName %>')
    .directive('fillMsg', function (validationMsgService) {
        return {
            restrict:'A',
            scope:{
                fillMsg:'@',
                msgArgs:'@'
            },
            link: function ($scope,$element,attrs) {
                if($element.text()){
                    return;
                }
                var msg = validationMsgService.getMsg($scope.fillMsg,$scope.msgArgs);
                $element.text(msg);
            }
        }
    });
