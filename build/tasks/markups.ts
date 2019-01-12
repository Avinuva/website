import gulp from 'gulp'
import browserSync from 'browser-sync'

import { inputs, outputs } from '../gulpconfig'

export default function statics() {
  return gulp
    .src(inputs.markups, {
      since: gulp.lastRun(statics),
    })
    .pipe(gulp.dest(outputs.markups))
    .pipe(browserSync.reload({ stream: true }))
}
