import gulp from 'gulp'
import pug from 'gulp-pug'
import browserSync from 'browser-sync'

import { inputs, outputs } from '../gulp.config'

export default function markups() {
  return gulp
    .src(inputs.markups)
    .pipe(pug({pretty: true}))
    .on('error', e => console.log)
    .pipe(gulp.dest(outputs.markups))
    .pipe(browserSync.reload({ stream: true }))
}
