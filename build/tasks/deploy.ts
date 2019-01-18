import tar from 'tar'
import ssh from 'ssh2'
import { outputs } from '../gulp.config'

export default function deploy() {
  return new Promise((resolve, reject) => {
    const conn = new ssh.Client()
    conn.on('ready', () => {
      conn.sftp(function(err, sftp) {
        if (err) throw err

        var writeStream = sftp.createWriteStream( "/bundle.tar.gz" );
        writeStream.on('close',function () {
            console.log( "- file transferred succesfully" );
            conn.exec('tar -xf /bundle.tar.gz', (err, ch) => {
              if (err) throw err
              console.log( "- untar" );
              conn.exec('mv /bundle /site', (err, ch) => {
                if (err) throw err
                console.log( "- renamed" );
                conn.end()
              })
            })
        });

        tar.create({gzip: true}, [outputs.bundle]).on('data', (d) => {
          // console.log(d.byteLength)
        }).pipe(writeStream)
      })
    })
    conn.on('error', e => {
      console.error(e)
      resolve()
    })

    conn.on('end', () => {
      resolve()
    })

    conn.connect({
      host: process.env.SERVER_IP,
      username: process.env.SERVER_USER,
      agent: process.env.SSH_AUTH_SOCK,
    })
  })
  // conn.on('ready', function() {
  //   console.log('Client :: ready');
  //   conn.shell(function(err, stream) {
  //     if (err) throw err;
  //     stream.on('close', function() {
  //       console.log('Stream :: close');
  //       conn.end();
  //     }).on('data', function(data) {
  //       console.log('STDOUT: ' + data);
  //     }).stderr.on('data', function(data) {
  //       console.log('STDERR: ' + data);
  //     });
  //     stream.end('ls -l\nexit\n');
  //   });
  // }).connect({
  //   host: '192.168.100.100',
  //   port: 22,
  //   username: 'frylock',
  //   privateKey: require('fs').readFileSync('/here/is/my/key')
  // });
}
