'use strict';

/**
 * @ngdoc function
 * @name <%= scriptAppName %>.controller:UsersCtrl
 * @description
 * # UsersCtrl
 * Controller of the circleApp
 */
angular.module('<%= scriptAppName %>')
    .controller('UserCtrl', function ($scope, resourcePool, dialogService, msgService,rootDataService) {
        var ResourceUser = resourcePool.user;
        var openUserDialog = function (userResource, done) {
            dialogService.complexBox({
                templateUrl: './views/user/user-dialog.html',
                onComplete: function (dialogScope, dialogInstance) {
                    dialogScope.isEdit = !!userResource;
                    dialogScope.user = userResource ? userResource.copy() : {};
                    //表单配置
                    dialogScope.formAPI = {};
                    dialogScope.formFields = [
                        {
                            key: 'loginName',
                            type: 'text',
                            label: '用户名',
                            validators: {
                                rules: {
                                    'ng-required': true
                                }
                            }
                        },
                        {
                            key: 'password',
                            type: 'password',
                            label: '密码',
                            validators: {
                                rules: {
                                    'ng-required': true
                                }
                            }
                        },
                        {
                            key: 'repassword',
                            type: 'password',
                            label: '确认密码',
                            validators: {
                                rules: {
                                    'ng-required': true,
                                    'equalto': 'password'
                                },
                                messages: {
                                    equalto: '与密码不一致'
                                }
                            }
                        },
                        {
                            key: 'name',
                            type: 'text',
                            label: '姓名',
                            validators: {
                                rules: {
                                    'ng-required': true
                                }
                            }
                        },
                        {
                            key: 'mobile',
                            type: 'text',
                            label: '手机',
                            validators: {
                                rules: {
                                    'ng-required': true,
                                    'mobile': true
                                },
                                messages: {
                                    mobile: '格式不正确'
                                }
                            }
                        },
                        {
                            key: 'email',
                            type: 'email',
                            label: '邮箱',
                            validators: {
                                rules: {
                                    'ng-required': true
                                },
                                messages: {
                                    email: '格式不正确'
                                }
                            }
                        }
                    ];
                    if (dialogScope.isEdit) {//修改时没有用户名，密码，确认密码这三项
                        dialogScope.formFields.splice(0, 3)
                    }
                    dialogScope.ok = function () {
                        var formObj = dialogScope.formAPI.getFormObj();
                        formObj.showError = true;
                        if (formObj.$invalid) {
                            return;
                        }
                        if (dialogScope.isEdit) {
                            dialogScope.user.$update(function () {
                                dialogInstance.close();
                                done && done(dialogScope.user);
                            })
                        } else {
                            ResourceUser.new(dialogScope.user, function (resource) {
                                dialogInstance.close();
                                done && done(resource);
                            })
                        }
                    };
                }
            })
        }
        $scope.gridData = {
            resources: []
        };
        $scope.datagridOptions = {
            grid: {
                Resource: ResourceUser
            },
            gridTop: {
                btnsGroup: [
                    {
                        href: 'javascript:void(0)',
                        text: '新增',
                        action: function () {
                            openUserDialog(null, function (newReource) {
                                $scope.gridData.resources.unshift(newReource);
                                msgService.success('新增成功');
                            })
                        }
                    }
                ],
                searchGroup: {
                    input: {
                        paramKey: 'keyword',
                        placeholder: '关键字'
                    },
                    btn: {
                        text: '搜索'
                    }
                }
            },
            gridTable: {
                cols: [
                    {
                        text: '账号',
                        property: 'loginName'
                    },
                    {
                        text: '姓名',
                        property: 'name'
                    },
                    {
                        text: '手机',
                        property: 'mobile'
                    },
                    {
                        text: '邮件',
                        property: 'email'
                    }
                ],
                rowClass: function (resource) {
                    return resource.dataStatus == 1 ? '' : 'text-muted'
                },
                operation: {
                    templateUrl: './views/user/user-ops.html',
                    actions: {
                        modify: function (resource, index) {
                            openUserDialog(resource, function (newResource) {
                                $scope.gridData.resources[index] = newResource;
                                msgService.success('修改成功');
                            })
                        },
                        del: function (resource, index) {
                            dialogService.confirm('确定删除吗？', function () {
                                resource.$delete(function () {
                                    $scope.gridData.resources.splice(index, 1);
                                    msgService.success('删除成功');
                                })
                            })
                        }
                    }
                }
            }

        }
    });
