'use strict';

import path from 'path';
import del from 'del';
import imagemin from 'gulp-imagemin';

module.exports = function(gulp, setgulp, plugins, config, target, browserSync) {
    let url = config;
    let dest = path.join(target);

    // Run task

    gulp.task('imagemin', () => {

        return gulp.src(path.join(target, '**/*'))
            .pipe(imagemin())
            .pipe(plugins.changed(dest))
            .pipe(gulp.dest(dest));

    });

}