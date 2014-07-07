var gulp = require('gulp'),
    gutil = require('gulp-util'),
    jade = require('gulp-jade'),
    less = require('gulp-less'),
    csso = require('gulp-csso'),
    newer = require('gulp-newer'),
    base64 = require('gulp-base64'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    requirejs = require('requirejs'),
    imagemin = require('gulp-imagemin'),
    connect = require('gulp-connect'),
    prefixer = require('gulp-autoprefixer'),

    src = {
        js: 'src/**/*.js',
        jade: 'src/index.jade',
        jade_all: 'src/**/*.jade',
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
    dst = 'dst',

    options = {
        min: false
    }

gulp.task('set-min', function(cb) {
    options.min = true;
    cb();
});

gulp.task('copy-images', function() {
    return gulp.src('images/*')
        .pipe(newer(dst + '/images'))
        .on('error', gutil.log)
        .on('error', gutil.beep)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}]
        }))
        .on('error', gutil.log)
        .on('error', gutil.beep)
        .pipe(gulp.dest(dst + '/images'));
});

gulp.task('copy-vendor-js', function() {
    return gulp.src(src.bower.js)
        .pipe(rename(function(path) {
            path.basename += '.min';
        }))
        .on('error', gutil.log)
        .on('error', gutil.beep)
        .pipe(newer(dst + '/scripts'))
        .on('error', gutil.log)
        .on('error', gutil.beep)
        .pipe(uglify())
        .on('error', gutil.log)
        .on('error', gutil.beep)
        .pipe(gulp.dest(dst + '/scripts'));
});

gulp.task('copy-vendor-css', function() {
    return !src.bower.css.length || gulp.src(src.bower.css)
        .pipe(newer(dst))
        .on('error', gutil.log)
        .on('error', gutil.beep)
        .pipe(gulp.dest(dst));
});

gulp.task('js', ['copy-vendor-js'], function() {
    return gulp.src(src.js)
        .pipe(newer(dst + '/scripts'))
        .on('error', gutil.log)
        .on('error', gutil.beep)
        .pipe(gulp.dest(dst + '/scripts'))
        .pipe(connect.reload());
});

gulp.task('rjs', ['js'], function(cb) {
    requirejs.optimize({
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
    cb();
});

gulp.task('jade', function() {
    return gulp.src(src.jade)
        .pipe(jade({
            pretty: true,
            data: {
                min: options.min
            }
        }))
        .on('error', gutil.log)
        .on('error', gutil.beep)
        .pipe(gulp.dest(dst))
        .pipe(connect.reload());
});

gulp.task('less', ['copy-vendor-css', 'copy-images'], function() {
    return gulp.src(src.less)
        .pipe(less())
        .on('error', gutil.log)
        .on('error', gutil.beep)
        .pipe(prefixer('last 2 version', '> 1%', 'ie 8', 'ie 7'))
        .on('error', gutil.log)
        .on('error', gutil.beep)
        .pipe(gulp.dest(dst))
        .pipe(connect.reload());
});

gulp.task('css-min', ['less'], function() {
    return gulp.src(dst + '/style.css')
        .pipe(csso())
        .on('error', gutil.log)
        .on('error', gutil.beep)
        .pipe(base64({
            baseDir: dst,
            extensions: ['svg', 'png']
        }))
        .on('error', gutil.log)
        .on('error', gutil.beep)
        .pipe(rename('style.min.css'))
        .on('error', gutil.log)
        .on('error', gutil.beep)
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

gulp.task('devel', ['js', 'jade', 'less']);
gulp.task('build', ['set-min', 'rjs', 'jade', 'css-min']);

gulp.task('default', ['devel', 'watch']);
