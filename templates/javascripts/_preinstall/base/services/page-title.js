'use strict';
/**
 * @ngdoc service
 * @name ngCustomBase.pageTitle
 * @description
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