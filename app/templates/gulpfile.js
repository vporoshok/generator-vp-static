var fs = require('fs'),
    gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    jade = require('gulp-jade'),
    less = require('gulp-less'),
    csso = require('gulp-csso'),
    newer = require('gulp-newer'),
    concat = require('gulp-concat'),
    base64 = require('gulp-base64'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    requirejs = require('requirejs'),
    imagemin = require('gulp-imagemin'),
    connect = require('gulp-connect'),
    pleeease = require('gulp-pleeease'),
    sourcemap = require('gulp-sourcemaps'),
    nunjucks = require('gulp-nunjucks-render'),

    src = {
        js: 'layout/js/*.js',
        jade: 'layout/jade/**/*.jade',
        less: 'layout/less/style.less',
        less_all: 'layout/less/**/*.less',
        img: 'layout/img/*'
    },
    dst = 'frontend',
    imageminrc = {
        progressive: true,
        svgoPlugins: []
    },
    jaderc = {
        pretty: true,
        data: {
            min: false
        }
    },
    requirerc = {
        baseUrl: dst + '/static/vendor/',
        name: '../js/script',
        out: dst + '/static/js/script.min.js',
        mainConfigFile: dst + '/static/js/script.js',
        paths: {
            jquery: 'empty:',
            backbone: 'empty:',
            bootstrap: 'empty:',
            lodash: 'empty:'
        }
    },
    lessrc = {
        'strictUnits': false,
        'strictMath': false
    },
    pleeeaserc = {
        autoprefixer: {
            browsers: ['> 5%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1'],
            cascade: true
        },
        import: {
            path: dst + '/static/css'
        },
        filters: true,
        rem: ['16px', {'replace': true}],
        opacity: true,
        mqpacker: true,
        minifier: false
    },
    cssorc = {},
    base64rc = {
        extensions: ['svg', 'png', 'gif']
    };

gulp.task('set-min', function(cb) {
    jaderc.data.min = true;
    cb();
});

gulp.task('copy-images', function() {
    return gulp.src(src.img)
        .pipe(plumber())
        .pipe(newer(dst + '/static/img'))
        .pipe(imagemin(imageminrc))
        .pipe(gulp.dest(dst + '/static/img'));
});

gulp.task('js', function() {
    return gulp.src(src.js)
        .pipe(plumber())
        .pipe(sourcemap.init())
        .pipe(newer(dst + '/static/js'))
        .pipe(sourcemap.write())
        .pipe(gulp.dest(dst + '/static/js'))
        .pipe(connect.reload());
});

gulp.task('rjs', ['js'], function(cb) {
    requirejs.optimize(requirerc);
    cb();
});

gulp.task('jade', function() {
    return gulp.src(src.jade)
        .pipe(plumber())
        .pipe(jade(jaderc))
        .pipe(rename(function(path) {
            path.extname = '.j2html';
        }))
        .pipe(gulp.dest(dst + '/templates'))
});

gulp.task('nunjucks', ['jade'], function() {
    nunjucks.nunjucks.configure([dst + '/templates'])
    return gulp.src(dst + '/templates/*.j2html')
        .pipe(plumber())
        .pipe(nunjucks(
            JSON.parse(
                fs.readFileSync('./layout/content.json', 'utf8')
            )
        ))
        .pipe(rename(function(path) {
            path.extname = '.html';
        }))
        .pipe(gulp.dest(dst))
        .pipe(connect.reload());
});

gulp.task('less', ['copy-images'], function() {
    return gulp.src(src.less)
        .pipe(plumber())
        .pipe(less(lessrc))
        .pipe(pleeease(pleeeaserc))
        .pipe(gulp.dest(dst + '/static/css'))
        .pipe(connect.reload());
});

gulp.task('css-min', ['less'], function() {
    return gulp.src(dst + '/static/css/style.css')
        .pipe(plumber())
        .pipe(csso(cssorc))
        .pipe(base64(base64rc))
        .pipe(rename('style.min.css'))
        .pipe(gulp.dest(dst + '/static/css'))
        .pipe(connect.reload());
});

gulp.task('server', function() {
    connect.server({
        root: dst,
        port: 3000,
        livereload: true
    });
});

gulp.task('watch', ['server'], function() {
    gulp.watch(src.js, ['js']);
    gulp.watch(src.jade, ['nunjucks']);
    gulp.watch('./layout/content.json', ['nunjucks']);
    gulp.watch(src.less_all, ['less']);
    gulp.watch(src.img, ['copy-images']);
});

gulp.task('devel', ['js', 'nunjucks', 'less']);
gulp.task('build', ['set-min', 'rjs', 'nunjucks', 'css-min']);

gulp.task('default', ['devel', 'watch']);
