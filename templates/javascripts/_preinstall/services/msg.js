'use strict';

/**
 * @ngdoc service
 * @name <%= scriptAppName %>.msgService
 * @description
 * # msgService 全局提示信息服务
 * Factory in the <%= scriptAppName %>.
 */
angular.module('<%= scriptAppName %>')
    .factory('msgService', function (rootDataService, $timeout) {
        var ROOT_messageData = rootDataService.data('ROOT_messageData');
        var timeout = {//提示停顿秒数
                "info": 2,
                "success": 2,
                "warning": 3,
                "danger": 5,
                "error": 5
            },
            timer,
            clear = function () {
                $timeout.cancel(timer);
                timer = 0;
            };
        return {
            alert: function (messages, type) {
                clear();
                type = type || 'info';
                (type === "error") && (type = "danger");
                messages = angular.isArray(messages) ? messages : [
                    {msg: messages}
                ];
                ROOT_messageData.set('globalMsg', {
                    messages: messages,
                    type: type,
                    show: true
                });
                timer = $timeout(function () {
                    ROOT_messageData.set('globalMsg', {
                        messages: '',
                        type: '',
                        show: false
                    });
                }, (timeout[type]) * 1000);
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