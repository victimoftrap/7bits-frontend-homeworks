var gulp = require('gulp');
var concat = require('gulp-concat');
var handlebars = require('gulp-compile-handlebars');
var rename = require('gulp-rename');
var browserSync = require('browser-sync').create();

// var cssmin = require('gulp-cssmin');
// var autoprefixer = require('gulp-autoprefixer');

var cssnano = require('gulp-cssnano');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var sourcemaps = require('gulp-sourcemaps');

var path = {
    css: './src/**/*.css',
    html: {
        pages: './src/pages/**/*.hbs',
        components: './src/components/**/*.hbs',
        componentsPath: './src/components/'
    },
    images:'./src/**/images/*',
    build: {
        root: './build/**',
        css: './build/styles',
        html: './build',
        images: './build/images'
    }
};

gulp.task('default', ['html', 'css', 'images', 'watch', 'hotReload']);

gulp.task('html', function () {
    return gulp.src(path.html.pages)
        .pipe(handlebars({}, {
            ignorePartials: true,
            batch: path.html.componentsPath
        }))
        .pipe(rename({
            dirname: '.',
            extname: '.html'
        }))
        .pipe(gulp.dest(path.build.html));
});

gulp.task('css', function () {
    return gulp.src(path.css)
        .pipe(sourcemaps.init())
        .pipe(postcss([autoprefixer()])) // .pipe(autoprefixer())
        .pipe(concat('main.css'))
        .pipe(cssnano()) // .pipe(cssmin())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.build.css));
});

gulp.task('images', function () {
    return gulp.src(path.images)
        .pipe(rename({
            dirname: '.'
        }))
        .pipe(gulp.dest(path.build.images));
});

gulp.task('prod', ['html', 'css', 'images']);

gulp.task('watch', function () {
    gulp.watch(path.html.pages, ['html']);
    gulp.watch(path.html.components, ['html']);
    gulp.watch(path.css, ['css']);
    gulp.watch(path.images, ['images']);
});

gulp.task('hotReload', function () {
    browserSync.init({
        server: {
            baseDir: path.build.html
        }
    });
    gulp.watch(path.build.root, browserSync.reload)
});