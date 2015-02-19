require.config({
    baseUrl: '/static/js/',
    urlArgs: "bust=" +  (new Date()).getTime(),
    paths: {
        jquery: [
            '//cdnjs.cloudflare.com/ajax/libs/jquery/1.11.2/jquery.min',
            'jquery/jquery'
        ]<% if (backbone) { %>,
        backbone: [
            '//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min',
            'backbone/backbone'
        ]<% } if (lodash) { %>,
        lodash: [
            '//cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.min',
            'lodash/dist/lodash'
        ]<% } %>,
        webshim: [
            '//cdnjs.cloudflare.com/ajax/libs/webshim/1.15.6/minified/polyfiller',
            '../vendor/webshim/js-webshim/minified/polyfiller'
        ],


        modernizr: '_modernizr'
    },
    shim: {
        'script.min': {
            init: function () {
                require(['script']);
            }
        },
        jquery: {
            exports: '$'
        },
        webshim: {
            deps: ['jquery', 'modernizr'],
            exports: 'webshim'
        }<% if (backbone) { %>,
        backbone: {
            deps: ['jquery', 'lodash'],
            exports: Backbone
        }<% } if (lodash) { %>,
        lodash: {
            exports: '_'
        }<% } %>
    }
});
