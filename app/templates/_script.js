require.config({
    paths: {
        jquery: [
            '//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min',
            'jquery.min'
        ]<% if (bootstrap) { %>,
        bootstrap: [
            '//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.2.0/js/bootstrap.min',
            'bootstrap.min'
        ]<% } if (backbone) { %>,
        backbone: [
            '//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min',
            'backbone.min'
        ],
        underscore: [
            '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min',
            'underscore.min'
        ]<% } %>
    },
    shim: {
        jquery: {
            exports: '$'
        }
    }
});
<% if (bootstrap) { %>require(['bootstrap']);<% } %>

require(['jquery'],
    function($) {
        'use strict';
});
