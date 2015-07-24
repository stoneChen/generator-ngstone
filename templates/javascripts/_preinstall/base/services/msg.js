'use strict';
/**
 * @ngdoc service
 * @name ngCustomBase.msg
 * @description 提示信息组件
 * # msg
 * Factory in the ngCustomBase.
 */
angular.module('ngCustomBase')
    .factory('msgService', function ($rootScope,$compile) {
        //var ROOT_msgData = rootDataService.data('ROOT_msgData');
        //ROOT_msgData.set('hideMsg', function () {
        //    ROOT_msgData.set('globalMsg', {
        //        messages: '',
        //        type: '',
        //        show:false
        //    });
        //});
        var J_body = angular.element('body');
        return {
            alert: function (messages, type) {
                type = type || 'info';
                (type === "error") && (type = "danger");
                messages = angular.isArray(messages) ? messages : [
                    {msg: messages}
                ];
                var msgEl = angular.element('<msg msg-data="msgData"></msg>');
                var scope = $rootScope.$new();
                scope.msgData = {
                    messages: messages,
                    type: type
                };
                J_body.append($compile(msgEl)(scope))
            },
            success: function (msgs) {
                this.alert(msgs, 'success');
            },
            error: function (msgs) {
                this.alert(msgs, 'danger');
            },
            info: function (msgs) {
                this.alert(msgs, 'info');
            },
            warn: function (msgs) {
                this.alert(msgs, 'warning');
            }
        }
    });