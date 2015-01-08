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
        validationMsgService.add('mincheck', '请至少选择{0}项');
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
    .directive('equalto', function ($parse) {//本校验只能用于vform中，modelObj写死了
        return {
            restrict: 'A',
            require: ['ngModel', '^form'],
            link: function postLink(scope, element, attrs, ctrls) {
                var ngModelCtrl = ctrls[0], vFormCtrl = ctrls[1];//todo 为了更好的效果，应该为attrs.equalTo也添加监听，暂时不知道怎么拿到attrs.equalTo的scope
                var toEqualGetter = $parse(attrs['equalto']);
                var context = scope.$parent.$parent['modelObj'];//这里的scope是vfield，parent是ng-repeat，再parent才是vform
                scope.$watch(attrs.ngModel, function (newVal) {
                    ngModelCtrl.$setValidity('equalto', ngModelCtrl.$error.required || (newVal == toEqualGetter(context)));
                })

            }
        };
    })
    .directive('mincheck', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ctrl) {
                var minNum = attrs.mincheck - 0;
                minNum = angular.isNumber(minNum) ? minNum : 1;
                var validateCheckbox = function () {
                    var checkedNum = 0;
                    angular.forEach(scope.modelValue, function (checked, k) {
                        checked && checkedNum++;
                    });
                    //设置校验结果
                    ctrl.$setValidity('mincheck', checkedNum >= minNum);
                };
                //因为checkbox是在ng-repeat中的，所以$parent才是vfield
                scope.$parent.$watch('modelValue', validateCheckbox, true)
            }
        }
    })
    .directive('splitwords', function () {
        return {
            restrict:'A',
            require:'ngModel',
            link: function (scope, element, attrs, ngModelCtrl) {
                var wordsReg = /^[^\,]+(\,[^\,]+)*\,?$/;
                scope.$watch(attrs.ngModel, function (newVal) {
                    ngModelCtrl.$setValidity('splitwords', ngModelCtrl.$error.required || wordsReg.test(newVal));
                })
            }
        }
    })
;
