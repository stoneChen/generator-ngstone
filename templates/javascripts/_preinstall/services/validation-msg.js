'use strict';

/**
 * @ngdoc service
 * @name <%= scriptAppName %>.validationMsgService
 * @description
 * # validationMsgService 根据校验信息key补充完整的中文校验信息
 * Factory in the <%= scriptAppName %>.
 */
angular.module('<%= scriptAppName %>')
    .factory('validationMsgService', function ($log) {
        var messages = {
            required: '不能为空',
            email: '格式不正确',
            url: '格式不正确',
            number: '只能为数字',
            minlength: '长度不能小于{0}',
            maxlength: '长度不能大于{0}'
        };
        var REG_NG_PREFIX = /^ng-/;
        var REG_VARS = /\{\d+\}/g;

        function formatVars(ruleName, ruleValue) {//目前只支持一个参数
            var msg = messages[ruleName] || '';
            if (!msg) {
                $log.error(ruleName + '校验信息未找到，请检查！');
                return msg;
            }
            msg = msg.replace(REG_VARS, function (m) {
                return ruleValue;
            });
            return msg;
        }

        return {
            add: function (ruleName, message) {
                if (messages[ruleName]) {
                    $log.error(ruleName + '已存在!');
                    return;
                }
                messages[ruleName] = message;
            },
            format: function (validators, type) {
                var rules = validators.rules || (validators.rules = {}), messages = validators.messages || (validators.messages = {});
                if (messages[type]) {//处理input的特殊type(如email，number等)
                    rules[type] = true;
                }
                angular.forEach(rules, function (ruleValue, ruleName) {
                    ruleName = REG_NG_PREFIX.test(ruleName) ? ruleName.substr(3) : ruleName;
                    if (!messages[ruleName]) {
                        messages[ruleName] = formatVars(ruleName, ruleValue);
                    }
                })
            },
            getMsg: formatVars
        };
    });
