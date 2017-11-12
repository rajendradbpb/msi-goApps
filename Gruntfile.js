module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';'
            },
            libs: {
                src: [
                    "public/plugins/jQuery/jQuery-2.2.0.min.js",
                    "public/dist/bootstrap/js/bootstrap.min.js",
                    "public/dist/js/app.js"
                ],
                dest: 'public/libs.js'
            },
            custom: {
                src: [
                    "public/main_app.js",
                    "public/filter.js",
                    "public/constants.js",
                    "public/modules/**/*.js",
                    "public/models/**/*.js",
                    "public/controller/**/*.js",
                    "public/directive/**/*.js"
                ],
                dest: 'public/custom.js'
            },
            angular: {
                src: [
                    "public/dist/js/angular/angular.js",
                    "public/dist/js/angular/angular-animate.js",
                    "public/dist/js/angular/ngStorage.min.js",
                    "public/dist/js/angular/angular-resource.js",
                    "public/dist/js/angular/angular-ui-router.js",
                    "public/dist/js/angular/angular-ui-utils.min.js",
                    "public/dist/js/angular/ui-bootstrap-tpls-0.14.3.min.js",
                    "public/dist/js/angular/ng-table.min.js",
                    "public/dist/js/angular/xlsx.core.min.js",
                    "public/dist/js/angular/angular-js-xlsx.js",
                    "public/dist/js/angular/angular-sanitize.min.js",
                    "public/dist/js/date-picker/angular-datepicker.min.js",
                    "public/dist/js/date-picker/moment.js",
                    "public/plugins/textEditor/textAngular.min.js",

                ],
                dest: 'public/ng-libs.js'
            },
        },
        uglify: {
            options: {
                mangle: true,
            },
            my_target: {
                files: {
                    'public/custom.js': ['public/custom.js'],
                    'public/libs.js': ['public/libs.js'],
                    'public/ng-libs.js': ['public/ng-libs.js'],
                }
            }
        },
        comments: {
            my_target: {
                options: {
                    singleline: true,
                    multiline: true
                },
                src: ['public/custom.js', 'public/libs.js']
            },
        },
        ngAnnotate: {
          options: {

          },
          appannotate: {
              files: {
                  'public/custom.js': ['public/custom.js']
              },
          },
        },
        watch: {
            options: {
                livereload: true,
            },
            debug: {
                files: ['public/*.js', 'public/**/*.js','public/*.html','public/**/*.html','!**/built/**','!**/public/custom.js','!**/public/libs.js','!**/public/ng-libs.js'],
                tasks: ['concat', 'comments:my_target', 'ngAnnotate:appannotate',"cssmin:combine"],
                options: {
                    livereload: true
                }
            },
            built: {
                files: ['public/dist/css/**','public/*.js', 'public/**/*.js','public/*.html','public/**/*.html','!**/built/**','!**/public/custom.js','!**/public/libs.js','!**/public/ng-libs.js'],
                tasks: ['concat', 'comments:my_target', 'ngAnnotate:appannotate', 'uglify:my_target', "cssmin:combine",'copy:main','htmlmin:dist'],
                options: {
                    livereload: true
                }
            },
            server: {
              files: ['app.js','server/*.js','server/**/*.js'],
              tasks: ['jshint'],
              options: {
                livereload: true,
                spawn: false,
              },
            }
        },
        clean: ["public/custom.js","public/libs.js","public/ng-libs.js","public/dist/css/all.css","built"],
        cssmin: {
            combine: {
                files: {
                    'public/dist/css/all.css': [
                    "public/dist/bootstrap/css/bootstrap.min.css",
                    "public/dist/css/style.css",
                    "public/dist/css/ng-table.min.css",
                    "public/dist/css/skins/_all-skins.css",
                    "public/dist/css/font-awesome.min.css",
                    "public/dist/js/date-picker/angular-datepicker.min.css",
                    ],
                }
            }
        },
        cachebreaker: {
          dev: {
              options: {
                  match: ['public/custom.js'],
              },
              files: {
                  src: ['public/index.html']
              }
          }
        },
        copy:{
          main: {
            files:[
              {
                expand: true,
                cwd:'public/',
                src: ['dist/css/all.css','dist/fonts/**','dist/img/**','custom.js','ng-libs.js','libs.js'],
                dest: 'built/'
              }
            ]
          }
        },
        htmlmin: {
            dist: {
              options: {
                removeComments: true,
                collapseWhitespace: true
              },
              files: [{
                expand: true,
                cwd: 'public/',
                src: ['**/*.html', '*.html'],
                dest: 'built/'
              }]
            }
        },
        nodemon: {
          // start: {
          //   script: './bin/www',
          //   tasks: ["concat:client","watch:client"]
          // },
          server: {
            script: './bin/www',
            tasks: ['watch:server']
          }
        },
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-stripcomments');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-cache-breaker');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-notify');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-nodemon');
    // Default task(s).
    grunt.registerTask('default', ['clean','concat','ngAnnotate:appannotate','cssmin:combine','comments:my_target','cachebreaker:dev','watch:debug']);
    grunt.registerTask('built', ['clean','concat','ngAnnotate:appannotate','uglify:my_target','cssmin:combine','copy:main','htmlmin:dist','comments:my_target','cachebreaker:dev','watch:built']);
    grunt.registerTask('server', ["nodemon:server"]);

};
