var requirejs = require('requirejs');

requirejs.config({
    urlArgs: 'v=' + new Date().getTime.toString(),
    paths: {
        'css': './node_modules/require-css/css.min'
    },
    map: {
        '*': {
            'css': './node_modules/require-css/css.min'
        }
    }
});