'use strict';

import path from 'path';
import autoprefixer from 'autoprefixer';
import gulpif from 'gulp-if';

module.exports = function(gulp, setgulp, plugins, config, target, browserSync) {
    let url = config;
    let dest = path.join(target, url.styles.assets);

    // Run task
    gulp.task('sass', () => {


        var autoprefixerOpts = {
            browsers: [
                'last 2 versions',
                'iOS >= 7',
                'Android >= 4',
                'Explorer >= 10',
                'ExplorerMobile >= 11'
            ],
            cascade: false
        };

        gulp.src([
                path.join(url.source, url.styles.sass, '**/*.{sass,scss}'),
                '!' + path.join(url.source, '{**/\_*,**/\_*/**}'),
                '!' + path.join(url.source, url.styles.sass, url.ignore.sass)
            ])
            .pipe(plugins.plumber())
            .pipe(gulpif(!setgulp.production, plugins.sourcemaps.init()))
            .pipe(plugins.sass({
                    outputStyle: 'expanded',
                    precision: 10,
                    includePaths: [
                        // 'node_modules/ionic-angular/',
                        // 'node_modules/ionicons/dist/scss',
                        path.join(url.source, url.styles.sass)
                    ]
                }).on('error', function(err) {
                    plugins.util.log(err);
                })
                .on('error', plugins.notify.onError(config.defaultNotification)))
            .pipe(plugins.postcss([autoprefixer(autoprefixerOpts)]))
            .pipe(gulpif(!setgulp.production, plugins.sourcemaps.write('./')))
            .pipe(gulp.dest(dest))
            .pipe(browserSync.stream({
                match: '**/*.css'
            }));


    });
}