var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
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
    pleeease = require('gulp-pleeease'),
    sourcemap = require('gulp-sourcemaps'),
    nunjucks = require('gulp-nunjucks-render'),

    src = {
        js: 'layout/**/*.js',
        jade: 'layout/**/*.jade',
        less: 'layout/style.less',
        less_all: 'layout/**/*.less',
        images: 'layout/images/*',
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
    dst = '<%= projectName %>',
    imageminrc = {
        progressive: true,
        svgoPlugins: [{removeViewBox: false}]
    },
    jaderc = {
        pretty: true
    },
    requirerc = {
        baseUrl: dst + '/static/scripts',
        name: 'script',
        out: dst + '/static/scripts/script.min.js',
        paths: {
            jquery: 'empty:',
            backbone: 'empty:',
            bootstrap: 'empty:',
            underscore: 'empty:'
        }
    },
    lessrc = {
        'strictMath': true,
        'strictUnits': true
    },
    pleeeaserc = {
        "autoprefixer": {
            browsers: ["> 5%", "last 2 versions", "Firefox ESR", "Opera 12.1"],
            cascade: true
        },
        "filters": true,
        "rem": true,
        "opacity": true,
        "mqpacker": true,
        "minifier": false
    },
    cssorc = {},
    base64rc = {
        baseDir: dst,
        extensions: ['svg', 'png']
    },

    options = {
        min: false
    }

gulp.task('set-min', function(cb) {
    options.min = true;
    cb();
});

gulp.task('copy-images', function() {
    return gulp.src(src.images)
        .pipe(plumber())
        .pipe(newer(dst + '/static/images'))
        .pipe(imagemin(imageminrc))
        .pipe(gulp.dest(dst + '/static/images'));
});

gulp.task('copy-vendor-js', function() {
    return gulp.src(src.bower.js)
        .pipe(plumber())
        .pipe(rename(function(path) {
            path.basename += '.min';
        }))
        .pipe(newer(dst + '/static/scripts'))
        .pipe(uglify())
        .pipe(gulp.dest(dst + '/static/scripts'));
});

gulp.task('copy-vendor-css', function() {
    return !src.bower.css.length || gulp.src(src.bower.css)
        .pipe(plumber())
        .pipe(newer(dst))
        .pipe(gulp.dest(dst + '/static'));
});

gulp.task('js', ['copy-vendor-js'], function() {
    return gulp.src(src.js)
        .pipe(plumber())
        .pipe(sourcemap.init())
        .pipe(newer(dst + '/static/scripts'))
        .pipe(sourcemap.write())
        .pipe(gulp.dest(dst + '/static/scripts'))
        .pipe(connect.reload());
});

gulp.task('rjs', ['js'], function(cb) {
    requirejs.optimize(requirerc);
    cb();
});

gulp.task('jade', function() {
    return gulp.src(src.jade)
        .pipe(plumber())
        .pipe(jade(Object.create(jaderc, {
            data: {
                min: options.min
            }
        })))
        .pipe(rename(function(path) {
            path.extname = '.j2html';
        }))
        .pipe(gulp.dest(dst + '/templates'))
        .pipe(connect.reload());
});

gulp.task('nunjucks', ['jade'], function() {
    nunjucks.nunjucks.configure([dst + '/templates'])
    return gulp.src(dst + '/templates/**/*.j2html')
        .pipe(plumber())
        .pipe(nunjucks())
        .pipe(rename(function(path) {
            path.extname = '.html';
        }))
        .pipe(gulp.dest(dst))
        .pipe(connect.reload());
});

gulp.task('less', ['copy-vendor-css', 'copy-images'], function() {
    return gulp.src(src.less)
        .pipe(plumber())
        .pipe(less(lessrc))
        .pipe(pleeease(pleeeaserc))
        .pipe(gulp.dest(dst + '/static'))
        .pipe(connect.reload());
});

gulp.task('css-min', ['less'], function() {
    return gulp.src(dst + '/static/style.css')
        .pipe(plumber())
        .pipe(csso(cssorc))
        .pipe(base64(base64rc))
        .pipe(rename('style.min.css'))
        .pipe(gulp.dest(dst + '/static'))
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
    gulp.watch(src.jade, ['jade', 'nunjucks']);
    gulp.watch(src.less_all, ['less']);
});

gulp.task('devel', ['js', 'nunjucks', 'less']);
gulp.task('build', ['set-min', 'rjs', 'nunjucks', 'css-min']);

gulp.task('default', ['devel', 'watch']);
