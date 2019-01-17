import gulp from 'gulp'
import { outputs } from '../gulp.config'

import { spawn } from 'child_process'

function git(dir: string, ...args) {
  new Promise((resolve, reject) => {
    console.log('start', args)

    const git = spawn('git', args,{ cwd: dir })
    git.stdout.on('data', d => console.log(d.toString()))
    git.stderr.on('data', d => console.log(d.toString()))
    git.on('close', code => {
      resolve()
    })
  })
}

export default async function  publish() {

    await git(outputs.bundle, 'init')
    await git(outputs.bundle, 'add', '.')
    await git(outputs.bundle, 'commit', '-m', 'update page')
    return git(outputs.bundle, 'push', '--force', 'git@github.com:netulip/website-frontend.git', 'master:gh-pages')
}
