var gulp = require('gulp'),
    jade = require('gulp-jade'),
    less = require('gulp-less'),
    connect = require('gulp-connect'),
    prefixer = require('gulp-autoprefixer'),

    src = {
        js: 'src/**/*.js',
        jade: 'src/index.jade',
        jade_all: 'src/**/index.jade',
        less: 'src/style.less',
        less_all: 'src/**/*.less',
        bower: [
            'bower_components/jquery/jquery.min.js',
            'bower_components/requirejs/require.js'
        ]
    },
    dst = 'dst';

gulp.task('copy-images', function() {
    return gulp.src('./images/*')
        .pipe(gulp.dest(dst + '/images'));
});

gulp.task('copy-vendor', function() {
    return gulp.src(src.bower)
        .pipe(gulp.dest(dst + '/scripts'));
});

gulp.task('js', ['copy-vendor'], function() {
    return gulp.src(src.js)
        .pipe(gulp.dest(dst + '/scripts'))
        .pipe(connect.reload());
});

gulp.task('jade', function() {
    return gulp.src(src.jade)
        .pipe(jade({
            pretty: true
        }))
        .on('error', console.log)
        .pipe(gulp.dest(dst))
        .pipe(connect.reload());
});

gulp.task('less', function() {
    return gulp.src(src.less)
        .pipe(less())
        .pipe(prefixer("last 2 version", "> 1%", "ie 8", "ie 7"))
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

gulp.task('build', ['js', 'jade', 'less', 'copy-images']);

gulp.task('default', ['build', 'watch']);
