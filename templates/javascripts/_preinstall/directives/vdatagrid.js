'use strict';

/**
 * @ngdoc directive
 * @name <%= scriptAppName %>.directive:vdatagrid
 * @description
 * # vdatagrid
 */
angular.module('<%= scriptAppName %>')
    .directive('vdatagrid', function ($q,utilService) {
        var extend = angular.extend,
            isFunction = angular.isFunction;
        return {
            restrict: 'E',
            replace: true,
            template: '<div class="data-grid" ng-transclude></div>',
            transclude: true,
            require: ['vdatagrid'],
            scope: {
                options: '='
            },
            controller: function ($scope) {
                $scope.Resource = $scope.options.Resource;
                var gridOptions = $scope.options;
                var self = this;
                var topScope, tableScope, paginationScope, searchParams,otherParams;
                var topDefer = $q.defer();
                function getOtherParams() {
                    return utilService.resultVal(otherParams);
                }
                self.communication = {
                    getSearchParams: function () {
                        return searchParams;
                    },
                    search: function () {
                        var queryParams = extend({},searchParams,getOtherParams());
                        $scope.Resource.query(queryParams, function (resources, response) {
                            tableScope.gridData.resources = resources;
                            //此处无需设置currentPage，gridPagination会去设置
                            paginationScope && (paginationScope.totalItems = response.totalCount);
                        })
                    },
                    setTopScope: function (scope) {
                        topScope = scope;
                        searchParams = scope.searchParams;
                        otherParams = scope.otherParams;
                        topDefer.resolve();
                    },
                    isSearchInLocal: function () {
                        return !!gridOptions.searchInLocal;
                    },
                    setTableScope: function (scope) {
                        tableScope = scope;
                        topDefer.promise.then(function () {//table依赖top，为了保证执行顺序，用了defer;
                            if (self.communication.isSearchInLocal()) {
                                topScope.$watch('searchParams[options.searchGroup.input.paramKey]', function (newVal) {
                                    tableScope.keyword = newVal;
                                })
                            } else {
                                tableScope.keyword = function (resource) {
                                    return resource;
                                }
                            }
                        })
                    },
                    setPaginationScope: function (scope) {
                        paginationScope = scope;
                    }
                };
            },
            link: function postLink(scope, element, attrs, ctrls, transcludeFn) {
//                var communication = ctrls[0].communication;
            }
        };
    })
    .directive('gridApi', function () {
        return {
            restrict: 'A',
            require: 'vdatagrid',
            link: function (scope, element, attrs, datagridCtrl) {
                var key = attrs.gridApi;
                scope[key] = {};
                var drCtrlCommunication = datagridCtrl.communication;
                angular.extend(scope[key], {
                    getSearchParams: drCtrlCommunication.getSearchParams,
                    search: drCtrlCommunication.search
                })
            }
        }
    })
    .directive('gridTop', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: './views/_widgets/vdatagrid/grid-top.html',
            require: ['^vdatagrid'],
            scope: {
                options: '='
            },
            controller: function ($scope) {
                $scope.btnsGroup = $scope.options.btnsGroup;
                $scope.searchGroup = $scope.options.searchGroup;
                $scope.filterGroup = $scope.options.filterGroup;
                $scope.otherParams = $scope.options.otherParams;
            },
            link: function postLink(scope, element, attrs, ctrls, transcludeFn) {
                scope.searchParams = {};//必须声明;
                var drCtrlCommunication = ctrls[0].communication;
                drCtrlCommunication.setTopScope(scope);
                scope.doSearch = function () {
                    drCtrlCommunication.search();
                }
                if (!drCtrlCommunication.isSearchInLocal()) {
                    scope.inputKeyup = function (event) {
                        if (event.keyCode === 13) {
                            scope.doSearch();
                        }
                    }
                }
            }
        };
    })
    .directive('gridTable', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: './views/_widgets/vdatagrid/grid-table.html',
            transclude: true,
            require: ['^vdatagrid'],
            scope: {
                options: '=',
                gridData: '='
            },
            controller: function ($scope) {
                $scope.cols = $scope.options.cols;
                $scope.operation = $scope.options.operation;
                $scope.rowClass = $scope.options.rowClass;
                $scope.beforeItemRender = $scope.options.beforeItemRender;
            },
            link: function postLink(scope, element, attrs, ctrls, transcludeFn) {
                var drCtrlCommunication = ctrls[0].communication;
                drCtrlCommunication.setTableScope(scope);
                drCtrlCommunication.search();
            }
        };
    })
    .directive('gridOperation', function ($compile, templateService) {
        return {
            restrict: 'E',
            replace: false,
            require: ['^gridTable'],
            scope: {
                resource: '=',
                rcIndex: '=resourceIndex',
                options: '='
            },
            controller: function ($scope) {
                $scope.actions = $scope.options.actions;
                $scope.btnPerm = $scope.options.btnPerm;
            },
            link: function postLink(scope, element, attrs, ctrls, transcludeFn) {
                var templatePromise = templateService.get(scope.options.templateUrl);
                templatePromise.success(function (tpl) {
                    element.append($compile(tpl)(scope));
                })
            }
        };
    })
    .directive('gridPagination', function () {
        return {
            restrict: 'E',
            replace: false,
            template: '<pagination class="mrg0 pull-right" total-items="totalItems" previous-text="&lt;&lt;" next-text="&gt;&gt;" ng-model="currentPage" ng-change="pageChanged(currentPage)"></pagination>',
            require: ['^vdatagrid'],
            scope: {},
            controller: function ($scope) {
            },
            link: function postLink(scope, element, attrs, ctrls, transcludeFn) {
                var drCtrlCommunication = ctrls[0].communication;
                drCtrlCommunication.setPaginationScope(scope);
                scope.pageChanged = function (targetPage) {
                    var params = drCtrlCommunication.getSearchParams();
                    params.currentPage = targetPage;
                    drCtrlCommunication.search();
                }
            }
        };
    })
