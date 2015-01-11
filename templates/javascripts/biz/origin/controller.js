'use strict';
/**
 * @ngdoc function
 * @name <%= scriptAppName %>.controller:<%= classedName %>Ctrl
 * @description
 * # <%= classedName %>Ctrl
 * Controller of the <%= scriptAppName %>
 */
angular.module('<%= scriptAppName %>')
    .controller('<%= classedName %>Ctrl', function ($scope,resourcePool,msgService,dialogService) {
        var resourceClass = resourcePool.<%= name %>;
        $scope.searchParams = {
            currentPage:$scope.currentPage
        };
        resourceClass.query($scope.searchParams, function (resources,data) {
            $scope.resources = resources;
            $scope.totalItems = data.totalCount
        });
        $scope.newRc = function () {

        };<%
        var tableCfg = bizCfg.dataGrid.gridTable,
            operation = tableCfg.operation,
            opBtn;
        for(var i = 0,l = operation.length;i < l;i++){
            opBtn = operation[i]; %>
        $scope.<%= opBtn.method  || ('opMethod' + i) %> = function(rcItem,index) {

        };<%
        } %>
    });
