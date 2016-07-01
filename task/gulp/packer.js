'use strict';

import path from 'path';
import packer from 'gulp-packer';
import streamify from 'gulp-streamify';
import concat from 'gulp-concat';

module.exports = function(gulp, setgulp, plugins, config, target, browserSync) {
    let url = config;
    let dest = path.join(target, url.scripts.assets);

    // Run task
    gulp.task('packer', () => {
        return gulp.src(path.join(target, url.scripts.assets, url.packer))
            .pipe(concat(url.packerdist))
            .pipe(streamify(packer({
                base62: true,
                shrink: true
            })))
            .pipe(gulp.dest(dest));
    });
}