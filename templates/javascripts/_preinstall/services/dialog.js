'use strict';

/**
 * @ngdoc service
 * @name <%= scriptAppName %>.dialogService
 * @description
 * # dialogService 对话框组件，包括确认框和复杂对话框
 * Factory in the <%= scriptAppName %>.
 */
angular.module('<%= scriptAppName %>')
    .factory('dialogService', function ($modal) {
        var complexBoxDefaultOptions = {
            templateUrl: '',
            controller: 'DialogComplexBoxCtrl',
            size: 'lg',
            backdrop: 'static',
            onComplete: angular.noop//在dialog创建成功后被调用，传入dialog的scope和modalInstance
        };
        return {
            confirm: function (msg, callback) {
                $modal.open({
                    templateUrl: './views/_widgets/dialog/confirm.html',
                    controller: 'DialogConfirmCtrl',
                    size: 'md',
                    backdrop: 'static',
                    resolve: {
                        msg: function () {
                            return msg;
                        }
                    }
                })
                    .result.then(callback);
            },
            complexBox: function (userOptions) {
                var options = angular.extend({}, complexBoxDefaultOptions, userOptions);
                options.resolve = {
                    'onComplete': function () {
                        return options.onComplete;
                    }
                };
                $modal.open(options)
            }
        };
    })
    .controller('DialogConfirmCtrl', function ($scope, $modalInstance, msg) {
        $scope.msg = msg;
        $scope.ok = function () {
            $modalInstance.close();
        };
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    })
    .controller('DialogComplexBoxCtrl', function ($scope, $modalInstance, onComplete) {
        onComplete($scope, $modalInstance);
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    })
    ;
