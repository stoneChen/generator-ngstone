'use strict';
/**
 * @ngdoc directive
 * @name ngCustomBase.directive:dialogSubpage
 * @description 滑入式子页面指令
 * # dialogSubpage
 */
angular.module('ngCustomBase')
    .directive('dialogSubpage', function ($window,utilService,$timeout) {
        var J_win = angular.element($window),
            J_body = angular.element('body');
        var history = $window.history;
        var BODY_CLASSNAME = 'subpage-open';
        var TRANSITION_END_IN = 'webkitTransitionEnd.in transitionend.in';
        var TRANSITION_END_OUT = 'webkitTransitionEnd.out transitionend.out';
        var subpageStack = [];

        var pushSubpage = function (pageData) {
            if(!subpageStack.length){//放入第一个子页面的时候，绑定popstate事件
                J_win.on('popstate.subpage', function () {
                    if(!subpageStack.length){
                        return;
                    }
                    popSubpage();
                });
            }
            subpageStack.push(pageData);
            history.pushState({type:'subpage'},'subpage' + subpageStack.length);
            pageData.el.on(TRANSITION_END_IN, function (event) {
                //J_body.addClass(BODY_CLASSNAME);//1.防止两个滚动条  2.防止子页面获取焦点时，父页面在顶部漏出来
                pageData.el.off(TRANSITION_END_IN);
            });

        };
        var popSubpage = function () {
            var pageData = subpageStack.pop();
            if(!subpageStack.length){//如果弹出后，没有子页面了，则恢复主页面，并移除popstate事件
                J_body.removeClass(BODY_CLASSNAME);
                J_win.off('popstate.subpage');
            }
            utilService.safeApply(pageData.scope,function () {
                pageData.scope.slideIn = false;//使子页面滑出
            });
            pageData.el.on(TRANSITION_END_OUT, function (event) {
                pageData.el.remove();
                pageData.scope.$destroy();
            });
        };

        return {
            restrict:'E',
            replace:true,
            transclude:true,
            template:'<div class="dialog-subpage" ng-class="{\'slide-in\':slideIn}" ng-transclude></div>',
            scope:{
                onComplete:'&',
                direction:'@'
            },
            link: function ($scope,$element,attrs,ctrl,$transclude) {
                if($scope.direction === 'up'){//自下向上滑入
                    $element.addClass("bottom-top");
                }
                $transclude($scope, function(clone) {//把transclude的内容添加到本scope
                    $element.empty().append(clone);
                });
                $scope.closePage = function () {
                    history.go(-1);
                };
                $scope.onComplete({subScope:$scope});//提供给调用者设置子页面的scope数据
                pushSubpage({
                    el:$element,
                    scope:$scope
                })
                //history.pushState({type:'subpage'},'subpage');
                //J_win.on('popstate.subpage', closePage);
                //$timeout(function () {
                    $scope.slideIn = true;//使子页面滑入
                //},10)
                //$element.on(TRANSITION_END_IN, function (event) {
                //    J_body.addClass(BODY_CLASSNAME);//1.防止两个滚动条  2.防止子页面获取焦点时，父页面在顶部漏出来
                //    $element.off(TRANSITION_END_IN);
                //});
                //
                //function closePage (){
                //    J_body.removeClass(BODY_CLASSNAME);//恢复
                //    utilService.safeApply($scope,function () {
                //        $scope.slideIn = false;//使子页面滑出
                //    });
                //    $element.on(TRANSITION_END_OUT, function (event) {
                //        $element.remove();
                //        $scope.$destroy();
                //    });
                //    J_win.off('popstate.subpage');
                //}
            }
        }
    });
