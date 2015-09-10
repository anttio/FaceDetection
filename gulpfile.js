var gulp    = require('gulp');
var gutil   = require('gulp-util');
var coffee  = require('gulp-coffee');

var paths = {
    scripts: ['./*.coffee']
};

gulp.task('coffee', function() {
    gulp.src(paths.scripts)
        .pipe(coffee({ bare: true }).on('error', gutil.log))
        .pipe(gulp.dest('./public/'));
});

gulp.task('watch', function() {
    gulp.watch(paths.scripts, ['coffee']);
});

gulp.task('default', function() {
    gulp.watch(paths.scripts, ['coffee']);
});
