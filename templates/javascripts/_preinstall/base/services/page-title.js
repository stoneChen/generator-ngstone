'use strict';
/**
 * @ngdoc service
 * @name ngCustomBase.pageTitle
 * @description 用于修改title，微信等webview仅仅修改document.title，将无法修改title，知乎上找到了此黑魔法[黑线]
 * # pageTitle
 * Factory in the ngCustomBase.
 */
angular.module('ngCustomBase')
    .factory('pageTitleService', function ($document) {
        var J_body = angular.element('body');
        var J_iframe = $('<iframe src="images/favicon.ico"></iframe>');
        var doc = $document[0];
        return {
            update: function (newTitle) {
                if(!newTitle){
                    return;
                }
                doc.title = newTitle;
                J_iframe.on('load', function() {
                    setTimeout(function() {
                        J_iframe.off('load').detach();
                    }, 0)
                }).appendTo(J_body)
            }
        };
    });