'use strict';

import fs from 'fs';
import path from 'path';
import foldero from 'foldero';
import nunjucks from 'gulp-nunjucks-html';
import yaml from 'js-yaml';

module.exports = function(gulp, setgulp, plugins, config, target, browserSync) {
    let url = config;
    let dest = path.join(target);
    let destnunjucks = path.join(target);
    let dataPath = path.join(url.source, url.data);

    // Run task

    // Nunjucks template compile
    gulp.task('nunjucks', () => {
        let siteData = {};
        if (fs.existsSync(dataPath)) {
            // Convert directory to JS Object
            siteData = foldero(dataPath, {
                recurse: true,
                whitelist: '(.*/)*.+\.(json|ya?ml)$',
                loader: function loadAsString(file) {
                    let json = {};
                    try {
                        if (path.extname(file).match(/^.ya?ml$/)) {
                            json = yaml.safeLoad(fs.readFileSync(file, 'utf8'));
                        } else {
                            json = JSON.parse(fs.readFileSync(file, 'utf8'));
                        }
                    } catch (e) {
                        console.log('Error Parsing DATA file: ' + file);
                        console.log('==== Details Below ====');
                        console.log(e);
                    }
                    return json;
                }
            });
        }

        // Add --debug option to your gulp task to view
        // what data is being loaded into your templates
        if (args.debug) {
            console.log('==== DEBUG: site.data being injected to templates ====');
            console.log(siteData);
            console.log('\n==== DEBUG: package.json config being injected to templates ====');
            console.log(config);
        }

        return gulp.src([
                path.join(url.source, '**/*.nunjucks'),
                '!' + path.join(url.source, '{**/\_*,**/\_*/**}'),
                '!' + path.join(url.source, url.layouts.nunjucks, url.ignore.nunjucks)
            ])
            .pipe(plugins.changed(dest))
            .pipe(plugins.plumber())
            .pipe(plugins.data({
                config: config,
                debug: true,
                site: {
                    data: siteData
                }
            }))
            .pipe(nunjucks({
                    searchPaths: [path.join(url.source)],
                    ext: '.html'
                })
                .on('error', function(err) {
                    plugins.util.log(err);
                }))
            .on('error', plugins.notify.onError(config.defaultNotification))
            .pipe(plugins.htmlmin({
                collapseBooleanAttributes: true,
                conservativeCollapse: true,
                removeCommentsFromCDATA: true,
                removeEmptyAttributes: true,
                removeRedundantAttributes: true
            }))
            .pipe(gulp.dest(dest))
            .on('end', browserSync.reload);
    });
}