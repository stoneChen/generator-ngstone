'use strict';
/**
 * @ngdoc directive
 * @name <%= scriptAppName %>.directive:<%= cameledName %>
 * @description
 * # <%= cameledName %>
 */
angular.module('<%= scriptAppName %>')
    .directive('<%= cameledName %>', function () {
        return {
            restrict:'E',
            replace:true,<%= directiveTemplateProperty %>
            scope:{
                
            },
            link: function ($scope,$element,attrs) {
                
            }
        }
    });
