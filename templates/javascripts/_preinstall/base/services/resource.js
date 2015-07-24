'use strict';
/**
 * @ngdoc service
 * @name ngCustomBase.resource
 * @description 基于官方angular-resource改造的resource
 * # resource
 * Factory in the ngCustomBase.
 */
angular.module('ngCustomBase')
    .factory('resourceService', function (xhrService) {
        var noop = angular.noop,
            forEach = angular.forEach,
            extend = angular.extend,
            copy = angular.copy,
            isArray = angular.isArray,
            isFunction = angular.isFunction;
        var $resourceMinErr = angular.$$minErr('rf-resource');
        var DEFAULT_ACTIONS = {
            'get': {
                method: 'get'
            },
            'query': {
                method: 'get',
                isArray: true,
                params: {
                    currentPage: 1
                }
            },
            'new': {
                method: 'post'
            },
            'update': {
                method: 'patch'
            },
            'save': {
                method: 'put'
            },
            'delete': {
                method: 'del'
            }
        }
        var VARS_RE = /{([^{]+)}/g;
        var defaultResourceConfig = {
//            requestSufix: '.json',//在xhr里统一加
            primaryKey: 'id',
            createResource:true
        }


        function resourceFactory(url, paramDefaults, actions, resourceConfig) {
            var resourceConfig = extend({}, defaultResourceConfig, resourceConfig || {});

            function Resource(resourceData) {
                extend(this, copy(resourceData));
            }

            function getHttpConfig(actionParams, invokeParams, data) {
                data = data || {};
                var finalParams = extend({}, paramDefaults, actionParams, invokeParams);
                var httpUrl = url;
                if (url.indexOf("{") > -1) {
                    httpUrl = url.replace(VARS_RE, function (m, key) {
                        var paramValue = finalParams[key] || data[key] || '';
                        paramValue = paramValue + "";
                        if (paramValue.charAt(0) === '@') {
                            var tmpKey = paramValue.substr(1);
                            paramValue = data[tmpKey] || '';
                        }
                        delete finalParams[key];//去掉匹配url变量的属性,剩下的加到http的params中去
                        return paramValue;
                    })
                }
                //    '//','///','////'... -> '/'
                httpUrl = httpUrl
                    .replace(/\/{2,}/g, '/')
                    .replace(/\/$/, '');
//                httpUrl += resourceConfig.requestSufix;//在xhr里统一加
                return {
                    url: httpUrl,
                    params: finalParams
                }
            }

            actions = extend({}, DEFAULT_ACTIONS, actions);
            forEach(actions, function (action, actionName) {
                var hasBody = /^(POST|PUT|PATCH)$/i.test(action.method);
                Resource[actionName] = function (a1, a2, a3, a4) {
                    var params = {}, data, success, error;
                    switch (arguments.length) {
                        case 4:
                            error = a4;
                            success = a3;
                        //fallthrough
                        case 3:
                        case 2:
                            if (isFunction(a2)) {
                                if (isFunction(a1)) {
                                    success = a1;
                                    error = a2;
                                    break;
                                }

                                success = a2;
                                error = a3;
                                //fallthrough
                            } else {
                                params = a1;
                                data = a2;
                                success = a3;
                                break;
                            }
                        case 1:
                            if (isFunction(a1)) success = a1;
                            else if (hasBody) data = a1;
                            else params = a1;
                            break;
                        case 0:
                            break;
                        default:
                            throw $resourceMinErr('badargs',
                                "Expected up to 4 arguments [params, data, success, error], got {0} arguments",
                                arguments.length);
                    }
//                    var isInstanceCall = this instanceof Resource;
                    var httpConfig = getHttpConfig(action.params, params, data);
//          var isNew = actionName === 'save' && (!data[resourceConfig.primaryKey]);//save默认更新
                    httpConfig.method = action.method;//isNew ? 'post' : action.method;
                    hasBody && (httpConfig.data = data);
                    var promise = xhrService.send(httpConfig);
                    promise.then(function (data) {
                        if (action.isArray) {
                            var retCollection = [];
                            var collection = data['collection'];
                            if (!isArray(collection)) {
                                throw $resourceMinErr(httpConfig.url + '返回值解析错误', '方法{0}配置为array类型，服务器返回data.collection为: {1}', actionName, data.collection);
                            }
                            if(resourceConfig.createResource){
                                forEach(collection, function (item) {
                                    retCollection.push(new Resource(item));
                                });
                            }else{
                                retCollection = collection;
                            }
                            (success || noop)(retCollection, data);
                            return retCollection;
                        } else {
                            var retModel = data['model'] || {};
                            var ret = resourceConfig.createResource ? new Resource(retModel) : retModel;
                            (success || noop)(ret);
                            return ret;
                        }
                    }, function (res) {
                        (error || noop)(res);
                    })
                    return promise;
                }

                Resource.prototype['$' + actionName] = function (params, success, error) {
                    if (isFunction(params)) {
                        error = success;
                        success = params;
                        params = {};
                    }
                    Resource[actionName].call(this, params, this, success, error);
                };
            });
            extend(Resource.prototype,{
                copy:function () {
                    var self = this;
                    var copyObj = {};
                    var keys = Object.getOwnPropertyNames(this);
                    keys.forEach(function(k){
                        if(k.indexOf('$$') === 0){
                            return;
                        }
                        if(isArray(self[k])){
                            copyObj[k] = copy(self[k]);
                        }else{
                            copyObj[k] = self[k];
                        }
                    })
                    return new Resource(copyObj);
                },
                isEqualById: function (resource) {
                    return this.id === resource.id;
                },
                isInArrayById: function (resources) {
                    var id = this.id;
                    var ret = false;
                    resources.some(function (rc) {
                        if(id === rc.id){
                            ret = true;
                            return true;
                        }
                    });
                    return ret;
                },
                removeFormArrayById: function (resources) {
                    var id = this.id;
                    var index = -1;
                    resources.some(function (rc,idx) {
                        if(id === rc.id){
                            index = idx;
                            return true;
                        }
                    });
                    if(index > -1){
                        resources.splice(index,1);
                    }
                }
            });
            return Resource;
        }

        return {
            create: resourceFactory
        };
    })
