require.config({
    baseUrl: '/static/vendor/',
    urlArgs: "bust=" +  (new Date()).getTime(),
    paths: {
        jquery: [
            '//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min',
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
        URI: 'uri.js/src',

        modernizr: '../js/modernizr'
    },
    shim: {
        jquery: {
            exports: '$'
        }<% if (backbone) { %>,
        backbone: {
            deps: ['jquery', 'lodash']
        }<% } if (lodash) { %>,
        lodash: {
            exports: '_'
        }<% } %>
    }
});


require([
    'jquery'<% if (lodash) { %>,
    'lodash'<% } %>,
    'modernizr'
], function($<% if (lodash) { %>, _<% } %>, modernizr) {
        'use strict';

});
