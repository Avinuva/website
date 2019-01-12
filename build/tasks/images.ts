import gulp from 'gulp'
import gulpif from 'gulp-if'
import imagemin from 'gulp-imagemin'

import { isProduction, inputs, outputs } from '../gulp.config'

export default function images() {
  return gulp
    .src(inputs.images, {
      since: gulp.lastRun(images),
    })
    .pipe(gulpif(isProduction, imagemin()))
    .pipe(gulp.dest(outputs.images))
}
