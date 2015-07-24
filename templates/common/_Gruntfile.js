// Generated on <%= (new Date).toLocaleString() %> using <%= pkg.name %> <%= pkg.version %>
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'
var os = require('os');
var fs = require('fs');
var path = require('path');

module.exports = function (grunt) {
    var gruntTaskParams = require('./grunt-task-params');
    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Configurable paths for the application
    var appConfig = {
        projectName: require('./bower.json').name + 'App',
        app: require('./bower.json').appPath || 'app',
        dist: 'dist'
    };
    /**
     * Get ip(v4) address
     * @return {String} the ipv4 address or 'localhost'
     */
    var getIPAddress = function () {
        var ifaces = os.networkInterfaces();
        var ip = '';
        for (var dev in ifaces) {
            ifaces[dev].forEach(function (details) {
                if (ip === '' && details.family === 'IPv4' && !details.internal) {
                    ip = details.address;
                    return;
                }
            });
        }
        return ip || "127.0.0.1";
    };
    function mockMiddleware(req, res, next) {
        //用于mock数据
        grunt.log.writeln('request from client:' + req.url);
        var urlReg = /^\/(.+)\?_method=(GET|POST|PATCH|DELETE|PUT).*$/;// /users/5.json?_method=GET
        var match = req.url.match(urlReg);// ['...','users/5','GET']
        if(!match){
            grunt.log.writeln('not matched,passed...');
            return next();
        }
        var fileNameSegments = [];
        var segments = match[1].split('/');
        segments.forEach(function (pathName) {
            if(/\D+/.test(pathName)){//非数字
                fileNameSegments.push(pathName)
            }else if(/\d+/.test(pathName)){//数字
                fileNameSegments.push('N')
            }
        });
        var fileName = fileNameSegments.join('.');// user.N
        fileName += '#' + match[2].toUpperCase() + '.json';// user.N#GET.json
        grunt.log.writeln('parsed fileName:' + fileName);
        var filePath = path.join('mock',segments[0],fileName);
        grunt.log.writeln('parsed filePath:' + filePath);
        var result = '';
        if(grunt.file.exists(filePath)){
            result = grunt.file.read(filePath);
        }else{
            result = JSON.stringify({
                stat:'ERROR',
                errors:'mock data file:[' + filePath + '] doesn\'t exist!'
            })
        }
        grunt.log.writeln(result);
        res.end(result);
    }
    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        yeoman: appConfig,

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            gruntfile: {
                files: ['Gruntfile.js']
            },
            livereload: {
                options: {
                    livereload: '<%%= connect.options.livereload %>'
                },
                files: [
                    '<%%= yeoman.app %>/index.html',
                    '<%%= yeoman.app %>/views/**/*.html',
                    '<%%= yeoman.app %>/scripts/**/*.js',
                    '<%%= yeoman.app %>/styles/**/*.css',
                    '<%%= yeoman.app %>/images/**/*.*',
                    'mock/**/*.json'
                ]
            },
            less:{
                files: "<%%= yeoman.app %>/styles/*.less",
                tasks: ["less","postcss"]
            }
        },
        less: {
            all: {
                options: {
                    paths: ["<%%= yeoman.app %>/styles"],
                    yuicompress: true
                },
                files: {
                    "<%%= yeoman.app %>/styles/all.css": "<%%= yeoman.app %>/styles/all.less"
                }
            }
        },
        //为css添加浏览器前缀
        postcss: {
            options: {
                //map: true,
                processors: [
                    require('autoprefixer-core')({browsers: '> 1%, last 2 versions, Firefox ESR, Opera 12.1'})
                ]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%%= yeoman.app %>/styles/',
                    src: 'all.css',
                    dest: '<%%= yeoman.app %>/styles/' //即使在开发环境下，希望也能够自动添加浏览器前缀，以便在开发环境下测试浏览器兼容性
                }]
            }
        },
        // The actual grunt server settings
        connect: {
            options: {
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: gruntTaskParams.serverBoundWithIP ? getIPAddress() : 'localhost',//connect似乎不能配置自动获取IP的方式打开地址,从anywhere偷了代码来
                open:true,
                livereload: 35729
            },
            livereload: {
                options: {
                    open:true,
                    middleware: function (connect) {
                        return [
                            function (req, res, next) {//首页注入脚本
                                if(req.originalUrl !== '/'){
                                    return next();
                                }
                                var indexHTMLPath = appConfig.app + '/index.html';
                                var indexHTML = grunt.file.read(indexHTMLPath);
                                var serveScripts = gruntTaskParams.serveScripts;
                                var scriptTags = [''];
                                serveScripts.forEach(function (script) {
                                    scriptTags.push('<script src="' + script + '"></script>');
                                });
                                var injectedHTML = indexHTML.replace(/<\/body>/, function(w) {
                                    return (scriptTags.concat([w])).join('\n');
                                });
                                res.end(injectedHTML);
                            },
                            function (req, res, next) {//其他中间件逻辑
                                return next();
                            },
                            connect().use(
                                '/bower_components',
                                connect.static('./bower_components')
                            ),
                            connect.static(appConfig.app),
                            mockMiddleware
                        ];
                    }
                }
            },
            test: {
                options: {
                    port: 9001,
                    middleware: function (connect) {
                        return [
                            connect.static('test'),
                            connect().use(
                                '/bower_components',
                                connect.static('./bower_components')
                            ),
                            connect.static(appConfig.app)
                        ];
                    }
                }
            },
            dist: {
                options: {
                    port: 9002,
                    middleware: function (connect) {
                        return [
                            connect.static('dist'),
                            mockMiddleware
                        ];
                    }
                }
            }
        },
        // Empties folders to start fresh
        clean: {
            dist: {
                files: [
                    {
                        dot: true,
                        src: [
                            '.tmp',
                            '<%%= yeoman.dist %>/{,*/}*',
                            '!<%%= yeoman.dist %>/.git*'
                        ]
                    }
                ]
            },
            server: '.tmp'
        },

        // Renames files for browser caching purposes
        filerev: {
            dist: {
                src: [
                    '<%%= yeoman.dist %>/scripts/{,*/}*.js',
                    '<%%= yeoman.dist %>/styles/{,*/}*.css',
                    '<%%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                    '<%%= yeoman.dist %>/styles/fonts/*'
                ]
            }
        },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            html: '<%%= yeoman.app %>/index.html',
            options: {
                dest: '<%%= yeoman.dist %>',
                flow: {
                    html: {
                        steps: {
                            js: ['concat', 'uglifyjs'],
                            css: ['cssmin']
                        },
                        post: {}
                    }
                }
            }
        },

        // Performs rewrites based on filerev and the useminPrepare configuration
        usemin: {
            html: ['<%%= yeoman.dist %>/{,*/}*.html', '<%%= yeoman.dist %>/scripts/scripts*.js'],//后面这一项是给打包好的模板里的图片等加后缀的
            css: ['<%%= yeoman.dist %>/styles/{,*/}*.css'],
            options: {
                assetsDirs: ['<%%= yeoman.dist %>', '<%%= yeoman.dist %>/images']
            }
        },

        htmlmin: {
            dist: {
                options: {
                    minifyJS:true,
                    collapseWhitespace: true,
                    conservativeCollapse: true,
                    collapseBooleanAttributes: true,
                    removeCommentsFromCDATA: true,
                    removeOptionalTags: true
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%%= yeoman.dist %>',
                        src: ['*.html'],//这里本来有会为拷贝过来的视图html文件的配置，因为使用了模板打包，所以就不需要了
                        dest: '<%%= yeoman.dist %>'
                    }
                ]
            }
        },

        // ng-annotate tries to make the code safe for minification automatically
        // by using the Angular long form for dependency injection.
        ngAnnotate: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '.tmp/concat/scripts',
                        src: ['*.js'],
                        dest: '.tmp/concat/scripts'
                    }
                ]
            }
        },


        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%%= yeoman.app %>',
                        dest: '<%%= yeoman.dist %>',
                        src: [
                            '*.{ico,png,txt}',
                            '*.html',
                            'images/**/*.*',
                            '!images/_tmp/*.*',//_tmp临时目录不复制
                            '!images/yeoman.png'//logo不复制
                        ]
                    },
                    {
                        expand: true,
                        cwd: 'bower_components/bootstrap/dist',
                        src: 'fonts/*',
                        dest: '<%%= yeoman.dist %>'
                    },
                    {
                        expand: true,
                        cwd: 'bower_components/fontawesome',
                        src: 'fonts/*',
                        dest: '<%%= yeoman.dist %>'
                    }
                    //more copies
                ]
            }
        },
        // Test settings
        karma: {
            unit: {
                configFile: 'test/karma.conf.js',
                singleRun: true
            }
        },
        protractor_invoker:{
            e2e:{
                configFile:'test/protractor.conf.js'
            }
        },
        concat: {//后期添加，将打包好了模板js，合并到之前的js里，由于useminPrepare通过读取index.html的注释生成concat的列表，无法将此模板文件打包进去，所以只能二次合并
            ngtemplates: {
                src: ['.tmp/concat/scripts/scripts.js', '.tmp/ngtemplates/ngtemplates.js'],
                dest: '.tmp/concat/scripts/scripts.js'
            }
        },

        sprite:{//合并sprite
            all: {
                src: ['<%%= yeoman.app %>/images/**/*.png',
                     '!<%%= yeoman.app %>/images/_tmp/**/*.png',
                     '!<%%= yeoman.app %>/images/spritesheet.png',//不排除的话，这个图片会重复，越来越大，因为本身也是png
                     '!<%%= yeoman.app %>/images/yeoman.png']//排除logo图片
                    .concat(gruntTaskParams.spriteSrcEX),
                dest: '<%%= yeoman.app %>/images/spritesheet.png',
                destCss: '<%%= yeoman.app %>/styles/sprites.css',
                cssTemplate:'sprite.css.handlebars',
                padding:2
            }
        },
        ngtemplates: {//后期添加，打包模板
            dist: {
                cwd: '<%%= yeoman.app %>',
                src: [
                    './views/**/*.html'//这里的./很重要，必须和指令里的templateUrl等一致，否则应用运行时，模板无法加载
                ],
                dest: '.tmp/ngtemplates/ngtemplates.js',
                options: {
                    module: '<%%= yeoman.projectName %>',
                    htmlmin: {
                        collapseBooleanAttributes: true,
                        collapseWhitespace: true,
                        removeAttributeQuotes: false,//必须为false，否则usemin的正则无法匹配
                        removeComments: true, // Only if you don't use comment directives!
                        removeEmptyAttributes: true,
                        removeRedundantAttributes: false, //removing this as it can removes properties that can be used when styling
                        removeScriptTypeAttributes: true,
                        removeStyleLinkTypeAttributes: true
                    }
                }
            }
        }
    });


    grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
        if (target === 'build') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }
        if (target === 'dist') {
            return grunt.task.run(['connect:dist:keepalive']);
        }

        grunt.task.run([
            'less',//启动时，编译一次，防止【服务没启动时，less做过修改而不生效】
            'postcss',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function (target) {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run(['serve:' + target]);
    });

    grunt.registerTask('test-unit', [
        'clean:server',
        'karma:unit'
    ]);
    grunt.registerTask('test-e2e', [
        'protractor_invoker'
    ]);
    grunt.registerTask('build', [
        'clean:dist',
        'less',//打包时，编译一次，防止【服务没启动时，less做过修改而不生效】
        'postcss',
        'ngtemplates',
        'useminPrepare',
        'concat:generated',
        'concat:ngtemplates',
        'ngAnnotate',
        'copy:dist',
        'cssmin',
        'uglify',
        'filerev',
        'usemin',
        'htmlmin'
    ]);
    grunt.registerTask('default', ['test:unit','build']);
};
