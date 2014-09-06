var gulp = require('gulp');

var jshint = require('gulp-jshint');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

// configuration
var paths = {
	scripts: [
		'src/js/**/*.js'
	]
};

gulp.task('scripts', function () {
	return gulp.src(paths.scripts)
		.pipe(jshint())
		.pipe(sourcemaps.init())
			.pipe(uglify())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(dest));
});