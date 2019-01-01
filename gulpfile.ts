import * as gulp from "gulp";
import * as rollup from 'rollup-stream'
import * as source from 'vinyl-source-stream'
import * as del from "del";
import * as typescript from 'rollup-plugin-typescript';
import * as postcss from 'gulp-postcss';
import * as sass from 'gulp-sass';
import * as sourcemaps from 'gulp-sourcemaps';
import * as imagemin from 'gulp-imagemin';

sass.compiler = require('node-sass');

gulp.task('sass', function () {
  return gulp.src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

export function styles() {
  return gulp.src('./source/styles/*.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(postcss())
  .pipe(gulp.dest("./bundle/assets/styles"))
}

export function clean() {
  return del(["bundle"]);
}

export function scripts() {
  return rollup({
    input: "./source/scripts/main.ts",
    format: "cjs",
    plugins: [
      typescript()
    ]
  })
    .pipe(source("app.js"))
    .pipe(gulp.dest("./bundle/assets/scripts"));
}

// export function images() {
//   return gulp.src(paths.images.src, {since: gulp.lastRun(images)})
//     .pipe(imagemin({optimizationLevel: 5}))
//     .pipe(gulp.dest(paths.images.dest));
// }

// export function scripts() {
//   return gulp
//     .src("./source/scripts/main.js")
//     .pipe(babel())
//     .pipe(concat("main.min.js"))
//     .pipe(gulp.dest("./bundle/scripts"));
// }

export const build = gulp.series(clean, gulp.parallel(images, styles, scripts));

export default build;

// gulp.task('rollup', function() {
//   return merge(glob.sync('./src/*.js').map(function(entry) {
//     return rollup({
//       entry: entry
//     })
//     .pipe(source(path.resolve(entry), path.resolve('./src')));
//   }))
//   .pipe(gulp.dest('./dist'));
// });

export function images() {
  return gulp.src("./source/images/*.{jpg,jpeg,png}", {since: gulp.lastRun(images)})
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest("./bundle/assets/images"));
}

export function watch() {
  gulp.watch("./source/scripts", scripts);
  gulp.watch("./source/styles", styles);
  gulp.watch("./source/images", images);
}

