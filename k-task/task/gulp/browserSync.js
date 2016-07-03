'use strict';


module.exports = function(gulp, setgulp, plugins, config, target, browserSync) {
    // Run task
    gulp.task('browserSync', () => {
        browserSync.init({
            open: (process.argv.slice(2) == 'server') ? true : false,
            startPath: config.baseUrl,
            port: config.port || 3000,
            server: {
                baseDir: target,
                routes: (() => {
                    let routes = {};

                    // Map base URL to routes
                    routes[config.baseUrl] = target;

                    return routes;
                })()
            }
        });
    });
}