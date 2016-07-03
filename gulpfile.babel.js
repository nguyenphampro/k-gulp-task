'use strict';

import path from 'path';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSyncLib from 'browser-sync';
import autoprefixer from 'autoprefixer';
import minimist from 'minimist';
import wrench from 'wrench';
import runSequence from 'run-sequence';

const fs = require('fs');
const yaml = require("js-yaml");
const load = yaml.load(fs.readFileSync("./k-task/config.yml"));

// Global 
const plugins = gulpLoadPlugins();

// Create karma server
const KarmaServer = require('karma').Server;

// Create a new browserSync

const defaultNotification = function(err) {
    return {
        subtitle: err.plugin,
        message: err.message,
        sound: 'Funk',
        onLast: true,
    };
};

// Call Config 
let config = Object.assign({}, load.config, defaultNotification);

// Call ENV 
let setgulp = minimist(process.argv.slice(2));

let target = setgulp.production ? config.dest : config.tmp;

let browserSync = browserSyncLib.create();
// Load Gulp tasks folder
wrench.readdirSyncRecursive('./k-task/task/gulp').filter((file) => {
    return (/\.(js)$/i).test(file);
}).map(function(file) {
    require('./k-task/task/gulp/' + file)(gulp, setgulp, plugins, config, target, browserSync);
});

// Default task
gulp.task('default', ['clean'], () => {
    gulp.start('k-task');
});

gulp.task('test', ['clean'], () => {
    gulp.start('testing');
});

gulp.task('serve', ['clean'], () => {
    gulp.start('live');
});

gulp.task('server', ['clean'], () => {
    gulp.start('live');
});

// Build task
gulp.task('build', ['cleanall'], () => {
    gulp.start('product');
});


// Basic production-ready code
gulp.task('k-task', function(cb) {
    runSequence(
        'concat',
        'copy',
        'fonts',
        'sass', // css, less, stylus 
        'jade', // hamber, ejs, pug 
        cb
    );
});


// Server with watch 
// NOTE: Can not run browserify with runSequence
gulp.task('live', [
    'k-task',
    'browserify',
    'browserSync',
    'watch'
]);


// Build production-ready code
gulp.task('product', [
    'k-task',
    'browserify'
]);

// Rebuild will call by browserify
gulp.task('rebuild', function(cb) {
    runSequence(
        // Call new task 
        'favicon',
        'inject-favicon-markups',
        'cssmin',
        'uglify',
        'htmlmin',
        'imagemin',
        'csscomb',
        'tobase64',
        'packer',
        'rev',
        'delete-css',
        'delete-js',
        'delete-packer',
        'revreplace',
        cb
    );
});


// Testing
gulp.task('testing', ['eslint'], (done) => {
    new KarmaServer({
        configFile: path.join('k-task', '/karma.conf.js'),
        singleRun: !setgulp.watch,
        autoWatch: setgulp.watch
    }, done).start();
});