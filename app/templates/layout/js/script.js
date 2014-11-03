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
        ]<% } if (backbone || underscore) { %>,
        underscore: [
            '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.7.0/underscore-min',
            'underscore.min'
        ]<% } %>
    },
    shim: {
        jquery: {
            exports: '$'
        }<% if (backbone) { %>,
        backbone: {
            deps: ['jquery', 'underscore']
        }<% } if (bootstrap) { %>,
        bootstrap: {
            deps: ['jquery']
        }<% } if (lightbox) { %>,
        lightbox: {
            deps: ['jquery'],
            exports: 'jQuery.fn.lightbox'
        }<% } %>
    }
});
<% if (bootstrap) { %>require(['bootstrap']);<% } %>
<% if (lightbox) { %>require(['lightbox']);<% } %>

require([
    'jquery',
    'modernizr'
], function($, modernizr) {
        'use strict';

});
