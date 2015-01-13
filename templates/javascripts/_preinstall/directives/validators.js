'use strict';

/**
 * @ngdoc directive
 * @name <%= scriptAppName %>.directive:validators
 * @description
 * # validators
 */
angular.module('<%= scriptAppName %>')
    .run(function (validationMsgService) {//在首次执行directive的时候，directiveFactory才会执行，所以默认校验信息只能在run这里添加
        validationMsgService.add('mobile', '格式不正确');
    })
    .directive('mobile', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function postLink(scope, element, attrs, ngModelCtrl) {
                var mobileReg = /^(1[3|4|5|7|8])[0-9]{9}$/;
                scope.$watch(attrs.ngModel, function (newVal) {
                    ngModelCtrl.$setValidity('mobile', ngModelCtrl.$error.required || mobileReg.test(newVal));
                })
            }
        };
    })
;
