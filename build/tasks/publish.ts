import { spawn } from 'child_process'
import listr from 'listr'

import { outputs } from '../gulp.config'

function git(...args) {
  return new Promise((resolve, reject) => {
    const git = spawn('git', args, { cwd: outputs.bundle })
    git.on('error', e => reject())
    git.on('close', () => resolve())
  })
}

export default async function publish() {
  const tasks = new listr([
    {
      title: 'Initializing repository',
      task: () => git('init'),
    },
    {
      title: 'Adding files',
      task: () => git('add', '.'),
    },
    {
      title: 'Commiting changes',
      task: () => git('commit', '-m', 'update page'),
    },
    // {
    //   title: 'Deleleting old version',
    //   task: () => git('push', '--progress', '--delete', 'git@github.com:netulip/website-frontend.git', 'gh-pages'),
    // },
    {
      title: 'Pushing new version',
      task: () => git('push', '--progress' , '--force', 'git@github.com:netulip/website-frontend.git', 'master:gh-pages'),
    },
  ])
  return tasks.run()
}
