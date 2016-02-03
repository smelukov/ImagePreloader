var allTestFiles = [];
var TEST_REGEXP = /(spec|test)\.js$/i;

var pathToModule = function(path) {
    return path.replace(/^\/base\//, '').replace(/\.js$/, '');
};

Object.keys(window.__karma__.files).forEach(function(file) {
    if (TEST_REGEXP.test(file)) {
        // Normalize paths to RequireJS module names.
        allTestFiles.push(pathToModule(file));
    }
});


require.config({
    paths: {
        'image-preloader': 'build/imagePreloader.min',
        'promise-ext-delay': 'node_modules/promise-ext-delay/build/promiseDelay.min',
        'es6-promise': 'node_modules/es6-promise/lib/es6-promise.umd'

    },
    baseUrl: '/base',
    deps: allTestFiles,
    callback: window.__karma__.start
});
