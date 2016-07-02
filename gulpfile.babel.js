'use strict';

import path from 'path';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSyncLib from 'browser-sync';
import autoprefixer from 'autoprefixer';
import minimist from 'minimist';
import wrench from 'wrench';
import yargs from 'yargs';
import runSequence from 'run-sequence';

const fs = require('fs');
const yaml = require("js-yaml");
const load = yaml.load(fs.readFileSync("./config.yml"));

// Global 
const plugins = gulpLoadPlugins();

// Create karma server
const KarmaServer = require('karma').Server;

// Create a new browserSync
let browserSync = browserSyncLib.create();

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
// let setgulp = yargs.argv;

let target = setgulp.production ? config.dest : config.tmp;
// Load Gulp tasks folder
wrench.readdirSyncRecursive('./task/gulp').filter((file) => {
    return (/\.(js)$/i).test(file);
}).map(function(file) {
    require('./task/gulp/' + file)(gulp, setgulp, plugins, config, target, browserSync);
});

// Default task
gulp.task('default', ['clean'], () => {
    gulp.start('k-task');
});

gulp.task('test', ['clean'], () => {
    gulp.start('testing');
});

// Build task
gulp.task('build', ['cleanall'], () => {
    gulp.start('product');
});


// Basic production-ready code
gulp.task('k-task', function(cb) {
    runSequence(
        'babel', // babel-concat
        'concat',
        'copy',
        'fonts',
        'sass', // css, less, stylus 
        'jade', // hamber, ejs, pug 
        cb
    );
});

// Server with watch 
gulp.task('serve', function(cb) {
    runSequence(
        'k-task',
        'browserify',
        'browserSync',
        'watch',
        cb
    );
});

// Build production-ready code
gulp.task('product', function(cb) {
    runSequence(
        'k-task',
        // Call new task 
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
        configFile: path.join(__dirname, '/karma.conf.js'),
        singleRun: !args.watch,
        autoWatch: args.watch
    }, done).start();
});