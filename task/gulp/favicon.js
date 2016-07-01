'use strict';

import path from 'path';
import del from 'del';
import realFavicon from 'gulp-real-favicon';

module.exports = function(gulp, setgulp, plugins, config, target, browserSync) {
    let url = config;
    let dest = path.join(target);

    // Run task


    gulp.task('favicon', (done) => {

        var FAVICON_DATA_FILE = 'faviconData.json';

        return realFavicon.generateFavicon({
            masterPicture: 'TODO: Path to your master picture',
            dest: 'TODO: Path to the directory where to store the icons',
            iconsPath: '/',
            design: {
                ios: {
                    pictureAspect: 'noChange',
                    assets: {
                        ios6AndPriorIcons: false,
                        ios7AndLaterIcons: false,
                        precomposedIcons: false,
                        declareOnlyDefaultIcon: true
                    }
                },
                desktopBrowser: {},
                windows: {
                    pictureAspect: 'noChange',
                    backgroundColor: '#da532c',
                    onConflict: 'override',
                    assets: {
                        windows80Ie10Tile: false,
                        windows10Ie11EdgeTiles: {
                            small: false,
                            medium: true,
                            big: false,
                            rectangle: false
                        }
                    }
                },
                androidChrome: {
                    pictureAspect: 'noChange',
                    themeColor: '#ffffff',
                    manifest: {
                        name: 'gfdgfdgfdg',
                        display: 'standalone',
                        orientation: 'notSet',
                        onConflict: 'override',
                        declared: true
                    },
                    assets: {
                        legacyIcon: false,
                        lowResolutionIcons: false
                    }
                },
                safariPinnedTab: {
                    pictureAspect: 'silhouette',
                    themeColor: '#5bbad5'
                }
            },
            settings: {
                scalingAlgorithm: 'Mitchell',
                errorOnImageTooSmall: false
            },
            markupFile: FAVICON_DATA_FILE
        }, function() {
            done();
        });

    });



    gulp.task('inject-favicon-markups', () => {
        gulp.src(['TODO: List of the HTML files where to inject favicon markups'])
            .pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
            .pipe(gulp.dest('TODO: Path to the directory where to store the HTML files'));
    });

    gulp.task('check-for-favicon-update', (done) => {
        var currentVersion = JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).version;
        realFavicon.checkForUpdates(currentVersion, function(err) {
            if (err) {
                throw err;
            }
        });
    });


}