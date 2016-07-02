'use strict';

import path from 'path';
import gulpif from 'gulp-if';
import minifyHtml from 'gulp-htmlmin';
// import htmlReplace from 'gulp-html-replace';

module.exports = function(gulp, setgulp, plugins, config, target, browserSync) {
    let url = config;
    let dest = path.join(target);

    // Run task

    gulp.task('htmlmin', () => {

        return gulp.src(path.join(target, '**/*.html'))
            .pipe(gulpif(setgulp.production, minifyHtml({
                collapseWhitespace: true,
                conservativeCollapse: true,
                collapseInlineTagWhitespace: true,
                collapseBooleanAttributes: true,
                removeCommentsFromCDATA: true,
                removeEmptyAttributes: true,
                removeRedundantAttributes: true
            })))
            .pipe(plugins.changed(dest))
            .pipe(gulp.dest(dest));

    });

}