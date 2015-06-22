'use strict';
/**
 * @ngdoc service
 * @name <%= scriptAppName %>.dialog
 * @description
 * # dialog
 * Factory in the <%= scriptAppName %>.
 */
angular.module('<%= scriptAppName %>')
    .factory('dialogService', function ($compile,$rootScope,templateService) {
        var J_body = angular.element('body');
        //var J_subpageContainer = angular.element('.subpage-container');
        return {
            confirm: function (options) {
                var confirmDOM = angular.element('<dialog-confirm></dialog-confirm>');
                confirmDOM.attr({
                    content:options.content,
                    action:'action'
                })
                var scope = (options.scope || $rootScope).$new();
                angular.extend(scope,options);
                var compiledDOM = $compile(confirmDOM)(scope);
                J_body.append(compiledDOM);
            },
            subpage: function (options) {
                var tplPromise = templateService.get(options.templateUrl);
                tplPromise.success(function (tpl) {
                    var confirmDOM = angular.element('<dialog-subpage></dialog-subpage>');
                    confirmDOM.attr({
                        'on-complete':'onComplete(subScope)',
                        'direction':options.direction || 'left'
                    }).html(tpl);
                    var scope = (options.scope || $rootScope).$new();
                    angular.extend(scope,options);
                    J_body.append(confirmDOM);
                    $compile(confirmDOM)(scope);
                });

            }
        };
    });