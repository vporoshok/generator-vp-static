require.config({
    paths: {
        jquery: [
            '//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min',
            'jquery.min'
        ]<% if (lightbox) { %>,
        lightbox: [
            '//cdnjs.cloudflare.com/ajax/libs/lightbox2/2.7.1/js/lightbox.min',
            'lightbox.min'
        ]<% } if (bootstrap) { %>,
        bootstrap: [
            '//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.2.0/js/bootstrap.min',
            'bootstrap.min'
        ]<% } if (backbone) { %>,
        backbone: [
            '//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min',
            'backbone.min'
        ]<% } if (lodash) { %>,
        lodash: [
            '//cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.min',
            'lodash.min'
        ]<% } %>
    },
    shim: {
        jquery: {
            exports: '$'
        }<% if (backbone) { %>,
        backbone: {
            deps: ['jquery', 'lodash']
        }<% } if (bootstrap) { %>,
        bootstrap: {
            deps: ['jquery']
        }<% } if (lightbox) { %>,
        lightbox: {
            deps: ['jquery'],
            exports: 'jQuery.fn.lightbox'
        }<% } if (lodash) { %>,
        lodash: {
            exports: '_'
        }<% } %>
    }
});
<% if (bootstrap) { %>require(['bootstrap']);<% } %>
<% if (lightbox) { %>require(['lightbox']);<% } %>

require([
    'jquery',
    'lodash',
    'modernizr'
], function($, _, modernizr) {
        'use strict';

});
