'use strict';

/**
 * @ngdoc directive
 * @name <%= scriptAppName %>.directive:vform
 * @description
 * # vform
 */
angular.module('<%= scriptAppName %>')
    .directive('vform', function ($q, $compile, $interpolate, vformGetTemplate) {
        var formTplDefer = vformGetTemplate('vform');
        var formBtnsGroupTplDefer = vformGetTemplate('vbtns');
        return {
            restrict: 'EA',
            replace: true,
            template: '<div></div>',
            scope: {
                fields: "=",
                formBtns: '=',
                modelObj: '=',
                api: '=',
                topTplDefer: '=',
                bottomTplDefer: '='
            },
            controller: function ($scope, $element, $parse) {
                $scope.api && angular.extend($scope.api,{
                    getFormObj: function () {
                        return $scope.vForm;
                    },
                    showError: function () {
                        $scope.vForm.showError = true;
                    }
                })
                $scope.onSubmit = function () {
                    $scope.vForm.showError = true;
                }
            },
            link: function (scope, element, attrs) {
                $q.all([formTplDefer, scope.topTplDefer, scope.bottomTplDefer, formBtnsGroupTplDefer]).then(function (tplsData) {
                    scope.$watch('fields',build);
                    function build(newVal){
                        var J_form = angular.element(tplsData[0].data);//表单主体
                        if (tplsData[1] && tplsData[1].data) {//顶部
                            var J_top = angular.element(tplsData[1].data);
                            J_form.prepend(J_top);
                        }
                        if (tplsData[2] && tplsData[2].data) {//底部
                            var J_bottom = angular.element(tplsData[2].data);
                            J_form.append(J_bottom);
                        }
                        if (scope.formBtns && tplsData[3] && tplsData[3].data) {//表单按钮
                            var J_btns = angular.element(tplsData[3].data);
                            J_form.append(J_btns);
                        }
                        var formElement = scope.formElement = $compile(J_form)(scope);
                        element.empty().append(formElement);
                    }
                });

            }
        }
    })
    .directive('vfield', function ($q, $compile, $interpolate, vformGetTemplate, validationMsgService,templateService) {
        var tplsArr = ['vfield', 'text', 'password', 'email', 'number', 'select', 'radio', 'checkbox'];
        var tplsMap = {};
        var tplsDefer = vformGetTemplate.multiple(tplsArr);
        tplsDefer.then(function (tplsData) {
            angular.forEach(tplsArr, function (tplName, index) {
                tplsMap[tplName] = tplsData[index].data;
            })
        });
        var $minErr = angular.$$minErr('rf-vfield');
        return {
            restrict: 'EA',
            replace: false,
//            templateUrl: '.views/vform/vfield.html',
            scope: {
                options: '=',
                formObj: '=',
                modelValue: '='
            },
            link: function (scope, element, attrs) {
                var options = scope.options;
                var isComplexCtrl = (tplsArr.indexOf(options.type) === -1);
                if(isComplexCtrl && !options.templateUrl){
                    throw $minErr('templateUrl missing','vform组件filed配置出错，type为{0}，不是内置控件，但没有提供模板url',options.type);
                }
                var complexCtrlTplPromise = isComplexCtrl && templateService.get(options.templateUrl);
                $q.all([complexCtrlTplPromise,tplsDefer]).then(function (tpls) {
                    var J_formGroup = angular.element(tplsMap['vfield']);
                    element.append(J_formGroup);
                    var tplCtrl = tplsMap[options.type] || tpls[0].data;
                    if(!tplCtrl){
                        throw $minErr('template missing','template 获取失败！');
                    }
                    if(!isComplexCtrl){//如果全部$interpolate，会把外部的{{}}都转换掉
                        //下面这句很关键！ngModel指令会调用form.$addControl方法，$addControl把名字加入到它自己的ctrls中去，此时控件模板中的{{}}表达式还未解析，所以需提前解析，否则需要使用dynamic-name
                        tplCtrl = $interpolate(tplCtrl,false)({options: options});
                    }
                    var J_ctrl = angular.element(tplCtrl);
                    options.bindScope && options.bindScope(scope);//提供给外部绑定监听等
                    element.find('.form-control-wrapper').prepend(J_ctrl);
                    if (options.validators && options.validators.rules) {
                        //由于radio和checkbox是用label包着的，所以得往下找input，为了兼容其他控件，用element.find('select,input')
                        element.find('select,input').attr(options.validators.rules);
                        //补全errorMsg
                        validationMsgService.format(options.validators, options.type);
                    }

                    element.replaceWith($compile(element.contents())(scope));
                });
            }
        }
    })
    .factory('vformGetTemplate', function ($q, templateService) {
        var getTemplate = function (templateUrl) {
            templateUrl = './views/_widgets/vform/' + templateUrl + '.html';
            return templateService.get(templateUrl);
        }
        getTemplate.multiple = function (templateUrls) {
            var defers = [];
            angular.forEach(templateUrls, function (url) {
                defers.push(getTemplate(url));
            });
            return $q.all(defers);
        };
        return getTemplate;
    })
