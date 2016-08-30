module.exports = function (grunt) {
    'use strict';
    require('load-grunt-tasks')(grunt, {
        pattern: ['grunt-*', 'sassdown']
    });

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        banner: [
            '/*!',
            ' * <%= pkg.name %> - Last build: <%= grunt.template.today("yyyy-mm-dd") %>',
            ' * Developers: <%= pkg.developers %>',
            ' *',
            ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.license %>',
            '**/'
        ].join('\n') + '\n',

        paths: {
            src: 'src/',
            docs: 'docs/',

            styles: '<%= paths.src %>styles/',
            scripts: '<%= paths.src %>scripts/',
            icons: '<%= paths.src %>icons/',
            images: '<%= paths.src %>images/',
            fonts: '<%= paths.src %>fonts/',
            vendor: '<%= paths.src %>vendor/',

            templates: '<%= pkg.templates %>',
            assets: '<%= pkg.assets %>',

            assetsStyles: '<%= pkg.assets %>styles/',
            assetsScripts: '<%= pkg.assets %>scripts/',
            assetsIcons: '<%= pkg.assets %>icons/',
            assetsImages: '<%= pkg.assets %>images/',
            assetsFonts: '<%= pkg.assets %>fonts/',
            assetsVendor: '<%= pkg.assets %>vendor/',
        },

        sass: {
            dev: {
                options: {
                    style: 'expanded'
                },
                files: {
                    '<%= paths.assetsStyles %>main.prefixfree.css': ['<%= paths.styles %>main.scss'],
                    '<%= paths.assetsStyles %>fonts.css': ['<%= paths.styles %>fonts.scss']
                }
            },
            editor: {
                options: {
                    style: 'compressed'
                },
                files: {
                    '<%= paths.assetsStyles %>editor.min.css': ['<%= paths.styles %>editor.scss']
                }
            },
            production: {
                options: {
                    style: 'compressed'
                },
                files: {
                    '<%= paths.assetsStyles %>main.prefixfree.min.css': ['<%= paths.styles %>main.scss'],
                    '<%= paths.assetsStyles %>fonts.min.css': ['<%= paths.styles %>fonts.scss']
                }
            }
        },
        autoprefixer: {
            dev: {
                options: {
                    browsers: ['last 2 versions', 'ie 10'],
                    map: true
                },
                files: {
                    '<%= paths.assetsStyles %>main.css': '<%= paths.assetsStyles %>main.prefixfree.css'
                }
            },
            production: {
                options: {
                    browsers: ['last 2 versions', 'ie 10'],
                    map: true
                },
                files: {
                    '<%= paths.assetsStyles %>main.min.css': '<%= paths.assetsStyles %>main.prefixfree.min.css'
                }
            }
        },
        watch: {
            scss: {
                files: [
                    '<%= paths.styles %>/**/*' //check all
                ],
                tasks: ['sass:dev', 'sass:production', 'autoprefixer', 'usebanner:defaultBanner'],
                options: {
                    livereload: false,
                }
            },
            images: {
                files: [
                    '<%= paths.images %>/*'
                ],
                tasks: ['copy:images'],
                options: {
                    livereload: false,
                }
            },
            vendor: {
                files: [
                    '<%= paths.vendor %>/*'
                ],
                tasks: ['copy:vendor'],
                options: {
                    livereload: false,
                }
            },
            scripts: {
                files: [
                    '<%= paths.scripts %>/**/*'
                ],
                tasks: ['copy:libs', 'uglify:production'],
                options: {
                    livereload: false,
                }
            }
        },

        uglify: {
            production: {
                options: {

                    banner: '<%= banner %>'
                },
                files: [{
                    expand: true,
                    cwd: '<%= paths.scripts %>',
                    src: '**/*.js',
                    dest: '<%= paths.assetsScripts %>/'
                }],
                rename: function (destBase, destPath) {
                    if (!destBase.match(/.min.js/)) {
                        return destBase + destPath.replace('.js', '.min.js');
                    }
                    return destBase + destPath;
                }
            }
        },
        modernizr: {
            dist: {
                'dest': '<%= paths.assetsScripts %>libs/modernizr.js',
                'uglify': true,
                'tests': ['csstransforms3d', 'backgroundsize', 'cssanimations', 'svg', 'generatedcontent', 'csstransitions'],
                'parseFiles': true
            }
        },
        copy: {
            fonts: {
                files: [{
                    expand: true,
                    cwd: '<%= paths.fonts %>',
                    src: '*.{eot,woff,woff2,ttf,svg}',
                    dest: '<%= paths.assetsFonts %>'
                }]
            },
            libs: {
                files: [{
                    expand: true,
                    cwd: '<%= paths.scripts %>libs/',
                    src: ['**'],
                    dest: '<%= paths.assetsScripts %>libs/'
                }]
            },
            images: {
                files: [{
                    expand: true,
                    cwd: '<%= paths.images %>',
                    src: ['**'],
                    dest: '<%= paths.assetsImages %>',
                    filter: 'isFile'
                }]
            },
            vendor: {
                files: [{
                    expand: true,
                    cwd: '<%= paths.vendor %>',
                    src: ['**'],
                    dest: '<%= paths.assetsVendor %>'
                }]
            }
        },
        browserSync: {
            bsFiles: {
                src: [
                    '<%= pkg.assets %>styles/*.css',
                    '<%= pkg.templates %>*.twig',
                ]
            },
            options: {
                watchTask: true,
                proxy: 'localhost'
            }
        },
        usebanner: {
            defaultBanner: {
                options: {
                    position: 'top',
                    banner: '<%= banner %>',
                    linebreak: true
                },
                files: {
                    src: ['<%= paths.assetsStyles %>main.min.css']
                }
            }
        },
        concurrent: {
            options: {
                limit: 4,
                logConcurrentOutput: true
            },
            dev: {
                tasks: ['watch:scss', 'watch:vendor', 'watch:images', 'watch:scripts']
            }
        },
    });

    grunt.registerTask('dev', [

        'sass:dev',
        'sass:production',

        'autoprefixer',

        'modernizr:dist',

        'copy:fonts',
        'copy:vendor',
        'copy:images',
        'copy:libs',

        'uglify:production',

        'usebanner:defaultBanner',

        //		'browserSync',

        'concurrent:dev'
    ]);
    grunt.registerTask('build', [
        'sass:dev',
        'sass:editor',
        'sass:production',

        'autoprefixer',

        'modernizr:dist',

        'copy:fonts',
        'copy:vendor',
        'copy:images',
        'copy:libs',

        'uglify:production',

        'usebanner:defaultBanner',
    ]);

};
