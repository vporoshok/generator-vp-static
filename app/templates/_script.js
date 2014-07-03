require.config({
    paths: {
        jquery: 'jquery.min'
    },
    shim: {
        jquery: {
            exports: '$'
        }
    }
});

require(['jquery'],
    function($) {
        'use strict';
});
