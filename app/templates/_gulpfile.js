var gulp = require('gulp'),
    jade = require('gulp-jade'),
    less = require('gulp-less'),
    rename = require('gulp-rename'),
    requirejs = require('requirejs'),
    imagemin = require('gulp-imagemin'),
    connect = require('gulp-connect'),
    prefixer = require('gulp-autoprefixer'),

    src = {
        js: 'src/**/*.js',
        jade: 'src/index.jade',
        jade_all: 'src/**/index.jade',
        less: 'src/style.less',
        less_all: 'src/**/*.less',
        bower: {
            'js': [
                'bower_components/jquery/jquery.js',
                'bower_components/requirejs/require.js'<% if (bootstrap) { %>,
                'bower_components/bootstrap/dist/js/bootstrap.js'<% } if (backbone) { %>,
                'bower_components/backbone/backbone.js',
                'bower_components/underscore/underscore.js'<% } %>
            ],
            'css': [<% if (bootstrap) { %>
                'bower_components/bootstrap/dist/css/bootstrap.min.css'<% } %>
            ]
        }
    },
    dst = 'dst';

gulp.task('copy-images', function() {
    return gulp.src('./images/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}]
        }))
        .pipe(gulp.dest(dst + '/images'));
});

gulp.task('copy-vendor-js', function() {
    return gulp.src(src.bower.js)
        .pipe(gulp.dest(dst + '/scripts'));
});

gulp.task('copy-vendor-css', function() {
    return gulp.src(src.bower.css)
        .pipe(gulp.dest(dst));
});

gulp.task('js', ['copy-vendor-js'], function() {
    return gulp.src(src.js)
        .pipe(gulp.dest(dst + '/scripts'))
        .pipe(connect.reload());
});

gulp.task('rjs', ['js'], function() {
    return requirejs.optimize({
        baseUrl: dst + '/scripts',
        name: 'script',
        out: dst + '/scripts/script.min.js',
        paths: {
            jquery: 'empty:',
            backbone: 'empty:',
            bootstrap: 'empty:',
            underscore: 'empty:'
        }
    });
});

gulp.task('jade', function() {
    return gulp.src(src.jade)
        .pipe(jade({
            pretty: true,
            data: {
                min: false
            }
        }))
        .on('error', console.log)
        .pipe(gulp.dest(dst))
        .pipe(connect.reload());
});

gulp.task('jade-min', function() {
    return gulp.src(src.jade)
        .pipe(jade({
            pretty: true,
            data: {
                min: true
            }
        }))
        .on('error', console.log)
        .pipe(gulp.dest(dst))
        .pipe(connect.reload());
});

gulp.task('less', ['copy-vendor-css'], function() {
    return gulp.src(src.less)
        .pipe(less({
            optimization: 1
        }))
        .pipe(prefixer('last 2 version', '> 1%', 'ie 8', 'ie 7'))
        .on('error', console.log)
        .pipe(gulp.dest(dst))
        .pipe(connect.reload());
});

gulp.task('less-min', ['copy-vendor-css'], function() {
    return gulp.src(src.less)
        .pipe(less({
            optimization: 1,
            compress: true,
            yuicompress: true
        }))
        .pipe(prefixer('last 2 version', '> 1%', 'ie 8', 'ie 7'))
        .pipe(rename('style.min.css'))
        .on('error', console.log)
        .pipe(gulp.dest(dst))
        .pipe(connect.reload());
});

gulp.task('server', function() {
    connect.server({
        root: 'dst',
        port: 3000,
        livereload: true
    });
});

gulp.task('watch', ['server'], function() {
    gulp.watch(src.js, ['js']);
    gulp.watch(src.jade_all, ['jade']);
    gulp.watch(src.less_all, ['less']);
});

gulp.task('devel', ['js', 'jade', 'less', 'copy-images']);
gulp.task('build', ['rjs', 'jade-min', 'less-min', 'copy-images']);

gulp.task('default', ['devel', 'watch']);
