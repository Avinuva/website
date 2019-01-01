import * as gulp from "gulp";
import * as rollup from "rollup-stream";
import * as source from "vinyl-source-stream";
import * as del from "del";
import * as typescript from "rollup-plugin-typescript";
import * as postcss from "gulp-postcss";
import * as sass from "gulp-sass";
import * as imagemin from "gulp-imagemin";
import * as browserSync from "browser-sync";
import * as merge from "gulp-merge";
import * as glob from "glob";
import * as path from "path";

sass.compiler = require("node-sass");

export function styles() {
  return gulp
    .src("./source/styles/*.scss")
    .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
    .pipe(postcss())
    .pipe(gulp.dest("./bundle/assets/styles"))
    .pipe(browserSync.reload({ stream: true }));
}

export function clean() {
  return del(["bundle"]);
}

export function copy() {
  return gulp
    .src(["./source/static/**/*", "./source/pages/*"], {
      since: gulp.lastRun(copy)
    })
    .pipe(gulp.dest("./bundle"))
    .pipe(browserSync.reload({ stream: true }))
}

export function scripts() {
  return merge(
    glob.sync("./source/scripts/*.ts").map(entry => {
      return rollup({
        input: entry,
        format: "cjs",
        plugins: [typescript()]
      })
        .pipe(source(`${path.basename(entry, ".ts")}.js`))
        .pipe(gulp.dest("./bundle/assets/scripts"));
    })
  ).pipe(browserSync.reload({ stream: true }));
}
export const build = gulp.series(
  clean,
  gulp.parallel(copy, images, styles, scripts)
);

export default build;

export function images() {
  return gulp
    .src("./source/images/*.{jpg,jpeg,png}", { since: gulp.lastRun(images) })
    .pipe(imagemin({ optimizationLevel: 5 }))
    .pipe(gulp.dest("./bundle/assets/images"));
}

function watch() {
  gulp.watch(["./source/static/**/*", "./source/pages/*"], copy);
  gulp.watch("./source/scripts", scripts);
  gulp.watch("./source/styles", styles);
  gulp.watch("./source/images", images);
}

function createServer(done) {
  browserSync({
    server: {
      baseDir: "./bundle"
    }
  });
}

export const serve = gulp.series(build, gulp.parallel(watch, createServer));
